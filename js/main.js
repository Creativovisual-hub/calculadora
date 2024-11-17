// Función para sumar las notas
const sumarNotas = (notas) => {
    return notas.reduce((total, nota) => total + nota, 0);
};

// Función para calcular el promedio
const calcularPromedio = (notas) => {
    const suma = sumarNotas(notas); // Llama a la función de suma
    return suma / notas.length; // Divide la suma entre el número de notas
};

// Notas del alumno
const notasAlumno = [6, 8, 9, 2, 5, 10];

// Llamadas y resultados
console.log("Suma de las notas:", sumarNotas(notasAlumno)); // Suma total de las notas
console.log("Promedio de las notas:", calcularPromedio(notasAlumno)); // Promedio calculado

