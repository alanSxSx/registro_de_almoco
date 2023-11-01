import api from "../Axios/api";
export class RegisterService {
  getRegistersSmall() {
    return fetch("data/db-small.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }

  async getRegisters() {
    //const response = await api.get("https://maliexpress.com.br/users");
    const response = await api.get('/users');
    const data = response.data;
    //console.log(data)
    return data;
  }

  async getSetores() {
   //const response = await api.get("https://maliexpress.com.br/setores");
    const response = await api.get('/setores');
    const data = response.data;
    //  console.log(data)
    return data;
  }

  getRegistersWithOrdersSmall() {
    return fetch("data/db-orders-small.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
