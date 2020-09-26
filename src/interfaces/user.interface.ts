interface User {
    id: string;
    gold: number;
    inventory: Map<string, any>
};

export default User;