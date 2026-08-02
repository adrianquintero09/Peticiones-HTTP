import express from "express"

const app = express()

app.use(express.json())

// =========================
// 🎬 BASE DE DATOS EN MEMORIA
// =========================
let peliculas = [
    {
        id: 1,
        titulo: "Spiderman 1",
        genero: "Ciencia ficción",
        director: "Sam Raimi",
        calificacion: 9.7
    }
]

// =========================
// 📌 GET - Todas las películas
// =========================
app.get("/peliculas", (req, res) => {
    res.json(peliculas)
})

// =========================
// 📌 GET - Por título
// =========================
app.get("/peliculas/:titulo", (req, res) => {

    const { titulo } = req.params

    const pelicula = peliculas.find(
        p => p.titulo.toLowerCase() === titulo.toLowerCase()
    )

    if (!pelicula) {
        return res.status(404).json({
            mensaje: "Película no encontrada"
        })
    }

    res.json(pelicula)
})

// =========================
// 📌 GET - Por género
// =========================
app.get("/peliculas/genero/:genero", (req, res) => {

    const { genero } = req.params

    const filtradas = peliculas.filter(
        p => p.genero.toLowerCase() === genero.toLowerCase()
    )

    res.json(filtradas)
})

// =========================
// 📌 POST - Crear película
// =========================
app.post("/peliculas", (req, res) => {

    const { titulo, genero, director, calificacion } = req.body

    if (!titulo || !genero) {
        return res.status(400).json({
            mensaje: "titulo y genero son obligatorios"
        })
    }

    const nuevaPelicula = {
        id: Date.now(),
        titulo,
        genero,
        director: director || "No definido",
        calificacion: calificacion || 0
    }

    peliculas.push(nuevaPelicula)

    res.json(nuevaPelicula)
})

// =========================
// 📌 PUT - Actualizar película completa
// =========================
app.put("/peliculas/:titulo", (req, res) => {

    const { titulo } = req.params

    const pelicula = peliculas.find(
        p => p.titulo.toLowerCase() === titulo.toLowerCase()
    )

    if (!pelicula) {
        return res.status(404).json({
            mensaje: "Película no encontrada"
        })
    }

    const { genero, director, calificacion } = req.body

    pelicula.genero = genero || pelicula.genero
    pelicula.director = director || pelicula.director
    pelicula.calificacion = calificacion || pelicula.calificacion

    res.json(pelicula)
})

// =========================
// 📌 PATCH - Solo calificación
// =========================
app.patch("/peliculas/:titulo/calificacion", (req, res) => {

    const { titulo } = req.params
    const { calificacion } = req.body

    const pelicula = peliculas.find(
        p => p.titulo.toLowerCase() === titulo.toLowerCase()
    )

    if (!pelicula) {
        return res.status(404).json({
            mensaje: "Película no encontrada"
        })
    }

    if (!calificacion || isNaN(calificacion)) {
        return res.status(400).json({
            mensaje: "Calificación inválida"
        })
    }

    pelicula.calificacion = Number(calificacion)

    res.json({
        mensaje: "Calificación actualizada",
        pelicula
    })
})

// =========================
// 📌 DELETE - Eliminar película
// =========================
app.delete("/peliculas/:titulo", (req, res) => {

    const { titulo } = req.params

    const index = peliculas.findIndex(
        p => p.titulo.toLowerCase() === titulo.toLowerCase()
    )

    if (index === -1) {
        return res.status(404).json({
            mensaje: "Película no encontrada"
        })
    }

    peliculas.splice(index, 1)

    res.json({
        mensaje: "Película eliminada"
    })
})

// =========================
// 📩 WEBHOOK (CONEXIÓN CON OTRO BACKEND)
// =========================
app.post("/webhook", (req, res) => {

    console.log("📩 Webhook recibido:", req.body)

    const data = req.body

    if (!data || !data.accion) {
        return res.status(400).json({
            mensaje: "Datos inválidos"
        })
    }

    // 🎬 CREAR
    if (data.accion === "crear") {

        const nuevaPelicula = {
            id: Date.now(),
            titulo: data.titulo,
            genero: data.genero || "Desconocido",
            director: data.director || "No definido",
            calificacion: data.calificacion || 0,
            origen: "webhook"
        }

        peliculas.push(nuevaPelicula)

        console.log("🎬 Película creada:", nuevaPelicula)
    }

    // 🗑️ ELIMINAR
    if (data.accion === "eliminar") {

        peliculas = peliculas.filter(
            p => p.titulo.toLowerCase() !== data.titulo.toLowerCase()
        )

        console.log("🗑️ Película eliminada:", data.titulo)
    }

    // ⭐ ACTUALIZAR
    if (data.accion === "actualizar") {

        const pelicula = peliculas.find(
            p => p.titulo.toLowerCase() === data.titulo.toLowerCase()
        )

        if (pelicula) {
            pelicula.calificacion = data.calificacion
            console.log("⭐ Película actualizada:", pelicula)
        }
    }

    res.json({
        mensaje: "Webhook procesado correctamente",
        estado: "ok"
    })
})

// =========================
// 🚀 SERVIDOR
// =========================
app.listen(3000, () => {
    console.log("🚀 Servidor iniciado en puerto 3000")
})