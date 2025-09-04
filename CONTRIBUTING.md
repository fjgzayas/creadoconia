# Guía de Contribución

¡Gracias por tu interés en contribuir al Sistema de Gestión de Estaciones! 

## 🚀 Cómo Contribuir

### 1. Fork y Clone
```bash
git clone https://github.com/tu-usuario/sistema-gestion-estaciones.git
cd sistema-gestion-estaciones
```

### 2. Configurar el Entorno
```bash
pnpm install
pnpm run dev
```

### 3. Crear una Rama
```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 4. Hacer Cambios
- Sigue las convenciones de código existentes
- Añade comentarios cuando sea necesario
- Asegúrate de que el código pase el linting: `pnpm run lint`

### 5. Commit y Push
```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 6. Crear Pull Request
- Describe claramente los cambios realizados
- Incluye capturas de pantalla si hay cambios visuales
- Referencia issues relacionados si aplica

## 📝 Convenciones de Código

### Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato (no afectan funcionalidad)
- `refactor:` refactorización de código
- `test:` añadir o modificar tests

### TypeScript
- Usar tipos explícitos cuando sea necesario
- Evitar `any`, usar tipos específicos
- Documentar interfaces complejas

### React
- Usar functional components con hooks
- Extraer lógica compleja a custom hooks
- Mantener componentes pequeños y enfocados

## 🐛 Reportar Bugs

1. Verificar que el bug no haya sido reportado
2. Crear un issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del entorno (OS, navegador, etc.)

## 💡 Sugerir Funcionalidades

1. Crear un issue con etiqueta "enhancement"
2. Describir claramente la funcionalidad propuesta
3. Explicar el caso de uso y beneficios
4. Considerar alternativas si las hay

## 🔍 Proceso de Review

- Todos los PRs requieren revisión
- Los cambios deben pasar el linting y build
- Se valorará la consistencia con el código existente
- Los cambios grandes pueden requerir discusión previa

## 📞 Contacto

- Issues: Para bugs y sugerencias
- Discussions: Para preguntas generales
- Email: Para temas sensibles

¡Gracias por contribuir! 🎉