import { itemsMap } from "./items";
import { recipesMap } from "./recipes";

export  function itemRecipeIconUrl(name:string): string {
    return `/item_recipe/${name}.png`
}

export function signalIconId(signalId: number) { return signalId; }
export function itemIconId(itemId: number) { return itemId; }
export function recipeIconId(recipeId: number) {
    const r = recipesMap.get(recipeId)!
    if (r.icon)
        return recipeId + 20000;
    return itemIconId(r.to[0].item.id);
}
export function techIconId(techId: number) { return techId + 40000; }

export function iconUrl(iconId: number) {

    if (iconId < 20000)
        return itemRecipeIconUrl(itemsMap.get(iconId)!.icon);
    if (iconId < 40000)
        return itemRecipeIconUrl(recipesMap.get(iconId - 20000)!.icon!);
    throw new Error(`Unknown icon ${iconId}`)
}

export function* allIconIds() {
    for (const i of itemsMap.values())
        yield itemIconId(i.id);

    for (const r of recipesMap.values()) {
        if (r.icon)
            yield recipeIconId(r.id)
    }

}

