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
  
	static async getByCuit(cuit: string) {
	  const client = await pool.query('SELECT * FROM cliente WHERE cuit = ?', [cuit]);
	  return client;
	}
  }
  