import { Entity, system, world } from '@minecraft/server';

interface Settings {
  'dm:use_manual_range': boolean;
  'dm:range': number;
}

world.afterEvents.playerBreakBlock.subscribe((event) => {
  const { block, player } = event;

  const settings = world.getPackSettings() as unknown as Settings;
  const { container } = player.getComponent('minecraft:inventory')!;

  let entities: Entity[];
  if (settings['dm:use_manual_range']) {
    const range = settings['dm:range'];
    entities = block.dimension.getEntities({
      type: 'minecraft:item',
      location: block.center(),
      maxDistance: range,
    });
  } else {
    entities = block.dimension.getEntitiesAtBlockLocation(block.location);
  }

  for (const entity of entities) {
    if (!entity.isValid) continue;

    const itemComponent = entity.getComponent('minecraft:item')
    if (!itemComponent) continue;

    container.addItem(itemComponent.itemStack);
    entity.remove();
  }
});
