export const TOPICS = [
  { id: "vida",       label: "Vida & rutina",     icon: "🌿", color: "#5C7A3E", bg: "#EEF5EC" },
  { id: "trabajo",    label: "Trabajo & estrés",  icon: "💼", color: "#7A4030", bg: "#FDEEE8" },
  { id: "mente",      label: "Mente & emociones", icon: "🧠", color: "#4A5A8A", bg: "#ECEEF8" },
  { id: "suenos",     label: "Sueños & metas",    icon: "✨", color: "#7A5A1A", bg: "#FBF3DC" },
  { id: "random",     label: "Lo que sea",        icon: "☕", color: "#6B4226", bg: "#F7EDE3" },
  { id: "relaciones", label: "Relaciones",        icon: "🤝", color: "#7A4060", bg: "#FDEEF4" },
];

export const HINTS = {
  vida:       "rutina, tiempo, energía",
  trabajo:    "presión, logros, bloqueos",
  mente:      "lo que no encuentras cómo decir",
  suenos:     "a dónde quieres llegar",
  random:     "sin tema, sin filtro",
  relaciones: "personas, vínculos, dinámicas",
};

export const STARTERS = {
  vida:       "Cuéntame cómo ha estado la rutina últimamente. ¿Algo que sientas que está funcionando, o todo lo contrario?",
  trabajo:    "El trabajo tiene una forma interesante de meterse en la cabeza. ¿Qué está pasando por allá?",
  mente:      "A veces hay cosas que no sabemos bien cómo nombrar. ¿Qué tienes guardado últimamente?",
  suenos:     "Los sueños y las metas son lo más honesto que tenemos. ¿Qué estás persiguiendo ahora mismo?",
  random:     "Siéntate. No hay tema obligatorio. ¿Por dónde arrancamos?",
  relaciones: "Las relaciones son complicadas y bonitas al mismo tiempo. ¿Qué está pasando con la gente que tienes cerca?",
};

export const RESPONSES = {
  vida: [
    "Eso que describes tiene mucho peso. ¿Cuándo fue la última vez que el día se sintió diferente?",
    "La rutina a veces es una trampa disfrazada de estabilidad. ¿Qué parte de tu día sientes más tuya?",
    "Hay algo honesto en lo que dices. ¿Qué cambiarías primero si pudieras?",
    "Eso suena a que llevas un tiempo cargando algo sin nombrarlo. ¿Qué es?",
    "Interesante. ¿Eso viene de ahora o ya viene de antes?",
    "¿Cómo te hace sentir cuando lo dices en voz alta?",
  ],
  trabajo: [
    "El trabajo tiene una forma de meterse en todos lados cuando no le ponemos límite. ¿Qué parte te pesa más?",
    "Eso que describes, ¿es algo nuevo o lleva un tiempo así?",
    "A veces el estrés no es por lo que hacemos sino por lo que no podemos controlar. ¿Cuál es tu caso?",
    "Cuéntame más. ¿El problema es el trabajo en sí o lo que te genera?",
    "Eso suena agotador. ¿Tienes espacio para desconectarte?",
    "¿Y cómo lo estás manejando hasta ahora?",
  ],
  mente: [
    "Eso que describes tiene nombre, aunque a veces cuesta encontrarlo. ¿Desde cuándo lo sientes?",
    "No todo tiene que tener explicación inmediata. ¿Qué parte de eso te genera más ruido?",
    "Hay algo importante en lo que estás diciendo. ¿Quieres quedarte ahí un momento?",
    "A veces lo que no podemos nombrar es lo que más nos pesa. ¿Hay algo que lo haya detonado?",
    "Eso suena a que llevas un rato procesando algo. ¿Lo has hablado con alguien antes?",
    "¿Cómo estás con eso ahora mismo, en este momento?",
  ],
  suenos: [
    "Los sueños bien claros dan miedo porque implican comprometerse. ¿Eso te pasa?",
    "Eso que describes, ¿es una meta nueva o lleva tiempo ahí sin moverse?",
    "¿Qué te frena más: el cómo o el miedo a que no funcione?",
    "Interesante. ¿Qué tan cerca o lejos se siente eso hoy?",
    "A veces el obstáculo no es la meta sino la historia que nos contamos sobre ella. ¿Qué historia tienes tú?",
    "¿Y si funcionara, cómo sería tu vida diferente?",
  ],
  relaciones: [
    "Las relaciones son complicadas porque nunca son solo una cosa. ¿Qué parte de eso te pesa más?",
    "Eso que describes, ¿es algo que viene de mucho tiempo o es más reciente?",
    "¿Has podido hablarle de esto a esa persona?",
    "A veces lo que más duele en una relación no es lo que pasa sino lo que no se dice. ¿Ese es tu caso?",
    "Cuéntame más. ¿Cómo es esa persona para ti?",
    "¿Y tú cómo te sientes en medio de todo eso?",
  ],
  random: [
    "Bien. Sin tema. A veces así es mejor. ¿Por dónde quieres empezar?",
    "De acuerdo. ¿Qué tienes en la cabeza ahora mismo?",
    "Perfecto. ¿Algo que hayas estado queriendo decir y no hayas tenido con quién?",
    "Cuéntame lo que quieras. Estoy aquí.",
    "¿Cómo ha estado el día?",
    "Sin filtro está bien. ¿Qué hay?",
  ],
  default: [
    "Entiendo. ¿Qué más hay en eso?",
    "Eso es interesante. ¿Lo has pensado antes?",
    "Cuéntame más.",
    "¿Cómo te hace sentir eso?",
    "Hay algo importante en lo que dices. ¿Puedes desarrollarlo?",
    "¿Desde cuándo es así?",
    "Eso tiene peso. ¿Qué parte de todo eso te genera más ruido?",
    "Sigo escuchando. ¿Qué más?",
  ],
};
