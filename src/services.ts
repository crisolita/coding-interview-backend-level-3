class IRM {
    static items: Item[] = [];
    static nextId: number = 1;
}

// Interfaz para definir los elementos
interface Item {
    id: number;
    name: string;
    price: number;
}

export async function getAllItems(): Promise<Item[]> {
    return [...IRM.items]; // Retorna una copia del arreglo
}

// Obtener un elemento por su ID
export async function getOneItem(id: number): Promise<Item | null> {
    return IRM.items.find(item => item.id == id) || null;
}

// Crear un nuevo elemento
export async function createItem(data: { name: string; price: number }): Promise<Item> {
    const newItem: Item = {
        id: IRM.nextId++,
        name: data.name,
        price: data.price,
    };
    IRM.items.push(newItem); // Agrega el nuevo elemento al arreglo
    return newItem;
}

// Actualizar un elemento existente
export async function updateItem(id: number, data: Partial<Omit<Item, 'id'>>): Promise<Item | null> {
    const index = IRM.items.findIndex(item => item.id == id);
    if (index == -1) return null; // Si no se encuentra, retorna null

    IRM.items[index] = {
        ...IRM.items[index],
        ...data, // Sobrescribe los campos con los nuevos valores
    };
    return IRM.items[index];
}

// Eliminar un elemento por su ID
export async function deleteItem(id: number): Promise<boolean> {
    const initialLength = IRM.items.length;
    IRM.items = IRM.items.filter(item => item.id != id); // Filtra los elementos
    return initialLength != IRM.items.length; // Retorna true si se eliminó algo
}

// Eliminar todos los elementos
export async function clear(): Promise<void> {
    IRM.items = []; // Limpia el arreglo
    IRM.nextId = 1; // Reinicia el contador de IDs
}



