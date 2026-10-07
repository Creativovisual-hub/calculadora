/*
 * Motor de cálculo de "Dividir la cuenta".
 * Replica la lógica de la planilla "Almuerzos y cuentas varias":
 *   1. Cada ítem se reparte entre quienes lo consumieron, según porciones.
 *   2. El descuento (% o $) se aplica a lo consumido por cada persona.
 *   3. La propina se calcula sobre el total ORIGINAL (antes del descuento),
 *      igual que en la planilla: "Total + propina = total*0,6 + total*0,1".
 *   4. Lo que corresponde a cada invitado/a (cumpleaños, visita) —incluida su
 *      propina— se divide en partes iguales entre quienes sí pagan.
 * Funciona en el navegador (window.CuentasCalc) y en Node (module.exports).
 */
(function (root) {
  'use strict';

  function num(v) {
    var n = Number(v);
    return isFinite(n) ? n : 0;
  }

  function fmtUnits(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }

  // Total de un ítem = precio unitario × cantidad
  function itemTotal(item) {
    return num(item.price) * (num(item.qty) || 1);
  }

  function compute(bill) {
    var people = bill.people || [];
    var items = bill.items || [];
    var tipPct = num(bill.tipPct) / 100;
    var discPct = Math.min(Math.max(num(bill.discountPct), 0), 100) / 100;
    var discFixed = Math.max(num(bill.discountFixed), 0);
    var tipBase = bill.tipBase === 'after' ? 'after' : 'before';

    var byId = {};
    var rows = people.map(function (p) {
      var r = {
        id: p.id, name: p.name, invited: !!p.invited, skipInvites: !!p.skipInvites,
        contribution: p.invited ? Math.max(num(p.contribution), 0) : 0,
        items: [], subtotal: 0, discount: 0, net: 0, tip: 0, own: 0,
        invitesShare: 0, invitesDetail: [], total: 0
      };
      byId[p.id] = r;
      return r;
    });

    // 1. Repartir ítems
    var unassigned = [];
    var billSubtotal = 0;
    items.forEach(function (item) {
      var total = itemTotal(item);
      billSubtotal += total;
      var shares = item.shares || {};
      var ids = Object.keys(shares).filter(function (id) { return byId[id] && num(shares[id]) > 0; });
      var weight = ids.reduce(function (s, id) { return s + num(shares[id]); }, 0);
      if (!ids.length || weight <= 0) {
        if (total > 0) unassigned.push({ id: item.id, name: item.name, amount: total });
        return;
      }
      // Por unidades: si se pidieron 2+ y las porciones no alcanzan a cubrirlas, cada persona paga
      // sus unidades y lo que sobra queda sin asignar (como "1 de 2 sin dueño").
      var qty = num(item.qty) || 1;
      var byUnits = item.byUnits && qty > 1 && weight < qty;
      var unit = total / qty;
      ids.forEach(function (id) {
        var amount = byUnits ? unit * num(shares[id]) : total * num(shares[id]) / weight;
        byId[id].subtotal += amount;
        byId[id].items.push({ name: item.name, amount: amount, portion: num(shares[id]), of: byUnits ? qty : weight });
      });
      if (byUnits && total > 0) {
        var free = qty - weight;
        unassigned.push({ id: item.id, name: item.name + ' (' + fmtUnits(free) + ' de ' + qty + ')', amount: unit * free, units: free });
      }
    });

    // Lo que nadie marcó ("Coca cola sin dueño") se puede repartir entre todos
    var unassignedTotal = unassigned.reduce(function (s, u) { return s + u.amount; }, 0);
    if (bill.splitUnassigned && unassignedTotal > 0 && rows.length) {
      var each = unassignedTotal / rows.length;
      rows.forEach(function (r) {
        r.subtotal += each;
        r.items.push({ name: 'Sin dueño (repartido)', amount: each, portion: 1, of: rows.length });
      });
    }

    var assignedSubtotal = rows.reduce(function (s, r) { return s + r.subtotal; }, 0);

    // 2–3. Descuento y propina por persona
    var fixed = Math.min(discFixed, assignedSubtotal * (1 - discPct));
    rows.forEach(function (r) {
      var share = assignedSubtotal > 0 ? r.subtotal / assignedSubtotal : 0;
      r.discount = r.subtotal * discPct + fixed * share;
      r.net = r.subtotal - r.discount;
      r.tip = tipPct * (tipBase === 'before' ? r.subtotal : r.net);
      r.own = r.net + r.tip;
    });

    // 4. Invitaciones: el costo del invitado se divide entre quienes pagan
    var payers = rows.filter(function (r) { return !r.invited && !r.skipInvites; });
    var invited = rows.filter(function (r) { return r.invited; });
    var invitesTotal = 0;
    invited.forEach(function (g) {
      var contribution = Math.min(g.contribution, g.own);
      var cost = g.own - contribution;
      invitesTotal += cost;
      if (!payers.length) return;
      var each = cost / payers.length;
      payers.forEach(function (p) {
        p.invitesShare += each;
        p.invitesDetail.push({ name: g.name, amount: each });
      });
      g.inviteCost = cost;
      g.inviteEach = each;
    });

    rows.forEach(function (r) {
      r.total = r.invited ? Math.min(r.contribution, r.own) : r.own + r.invitesShare;
    });

    var totals = {
      subtotal: billSubtotal,
      assigned: assignedSubtotal,
      unassigned: bill.splitUnassigned ? 0 : unassignedTotal,
      discount: rows.reduce(function (s, r) { return s + r.discount; }, 0),
      tip: rows.reduce(function (s, r) { return s + r.tip; }, 0),
      invites: invitesTotal,
      toPay: rows.reduce(function (s, r) { return s + r.total; }, 0)
    };
    totals.net = totals.assigned - totals.discount;
    // Lo que cobra el local por toda la boleta (incluye lo que nadie marcó)
    var billDiscount = billSubtotal * discPct + Math.min(discFixed, billSubtotal * (1 - discPct));
    totals.billDiscount = billDiscount;
    totals.billTip = tipPct * (tipBase === 'before' ? billSubtotal : billSubtotal - billDiscount);
    totals.billTotal = billSubtotal - billDiscount + totals.billTip;

    return {
      rows: rows,
      unassigned: unassigned,
      totals: totals,
      warnings: {
        noPayers: invited.length > 0 && payers.length === 0,
        unassigned: !bill.splitUnassigned && unassignedTotal > 0
      }
    };
  }

  // Redondea hacia arriba al múltiplo indicado (1, 10, 100) para no quedar cortos
  function roundUp(value, step) {
    step = num(step) || 1;
    return Math.ceil(Math.round(value * 100) / 100 / step) * step;
  }

  function clp(value) {
    var n = Math.round(num(value));
    var s = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (n < 0 ? '-$' : '$') + s;
  }

  var api = { compute: compute, itemTotal: itemTotal, roundUp: roundUp, clp: clp };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CuentasCalc = api;
})(this);
