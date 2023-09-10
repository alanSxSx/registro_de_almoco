export class RegisterService {

    getRegistersSmall() {
        return fetch('data/db-small.json').then(res => res.json()).then(d => d.data);
    }
   
        async getRegisters() {
            const response = await fetch('http://localhost:8080/users');
            const data = await response.json();
            // console.log(data)
            return data;
        }

        async getSetores() {
            const response = await fetch('http://localhost:8080/setores');
            const data = await response.json();
            // console.log(data)
            return data;
        }
    
    

    getRegistersWithOrdersSmall() {
        return fetch('data/db-orders-small.json').then(res => res.json()).then(d => d.data);
    }
}