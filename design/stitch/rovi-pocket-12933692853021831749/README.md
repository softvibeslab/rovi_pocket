# ROVI Pocket Stitch Export

Export generado desde el proyecto Stitch `ROVI Pocket` (`12933692853021831749`).

## Contenido

- `project.json`: metadata completa del proyecto.
- `manifest.json`: índice de pantallas, descargas y design systems exportados.
- `screens/<screen-id>-<slug>/screen.json`: metadata de cada pantalla.
- `screens/<screen-id>-<slug>/code.*`: código hospedado por Stitch.
- `screens/<screen-id>-<slug>/screenshot.png`: imagen descargada cuando Stitch la expone.
- `design-systems/<asset-id>/design-system.json`: asset del design system.
- `design-systems/<asset-id>/design-system.md`: guidelines del design system.

## Notas

- `ROVI_POCKET_FIGMA_PROMPTS.md` se exportó como `code.md` porque Stitch lo expone como markdown.
- `Rovi Pocket PRD & Design System Guidelines` se exportó como `code.html`; Stitch no expone screenshot para esa pantalla.
- El asset `Design System` no expone screenshot/code como screen independiente en la API actual; por eso se exportó como JSON + markdown del sistema de diseño.

## Reejecutar

```bash
STITCH_API_KEY='<token>' python3 apps/rovi-pocket/scripts/fetch_stitch_project.py \
  --project-id 12933692853021831749 \
  --out-dir apps/rovi-pocket/design/stitch/rovi-pocket-12933692853021831749 \
  --screen-id 13288562918631551807 \
  --screen-id c6fa51f66e1e402fa1ea0e9f0a1ada49 \
  --screen-id 37bb23261606493f8487654f284a0a06 \
  --screen-id db0510169a9b47e386f75092e244175b \
  --screen-id ce22426dd10a457d86cca3824903e99a \
  --screen-id 5f5c8fce0f35472abb291fb38ed66517 \
  --screen-id 52758ffeb0ba48ebb2c06b890c9c63ae
```
