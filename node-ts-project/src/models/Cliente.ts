import { pool } from '../db.js'

export class Cliente {
	id: number;
	cuit: string;
	razonSocial: string;
  
	constructor(id: number, cuit: string, razonSocial: string) {
	  this.id = id;
	  this.cuit = cuit;
	  this.razonSocial = razonSocial;
	}
  
	// Métodos para interactuar con la base de datos (por ejemplo, usando un ORM o SQL directo)
	// Por ejemplo, un método para obtener clientes por su CUIT
	static async getByCuit(cuit: string) {
	  // Aquí puedes hacer la consulta SQL para obtener un cliente por su CUIT
	  const client = await pool.query('SELECT * FROM cliente WHERE cuit = ?', [cuit]);
	  return client;
	}
  
	// Otros métodos de CRUD pueden ser definidos aquí...
  }
  