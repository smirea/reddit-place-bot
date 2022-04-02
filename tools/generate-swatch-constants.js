/**
 * USAGE:
 *  - select the swatch container with the inspector
 *  - paste this code in the console
 *  - paste the output in src/utils/constants.ts (it will put shit in your clipboard)
 */

__container = $0;
__colors = Array.from(__container.querySelectorAll('[data-color]'))
    .map(el => {
        const name = el.parentElement.children[1].textContent.trim();
        const id = parseInt(el.dataset.color, 10);
        const color = el.children[0].style.backgroundColor;
        return { id, name, color };
    })
    .flat();

__text = [
    'const COLORS_BY_ID = {',
    ...__colors.map(item => [
        `    ${item.id}: {`,
        `        id: ${item.id},`,
        `        name: '${item.name}',`,
        `        color: '${item.color}',`,
        `    },`,
    ]).flat(),
    '} as const;',
    '',
    'export const COLORS = {',
    ...__colors.map(item => `${item.id}: COLORS_BY_ID[${item.id}],`),
    ...__colors.map(item => `'${item.name}': COLORS_BY_ID[${item.id}],`),
    '} as const;',
].join('\n');

copy(__text);
