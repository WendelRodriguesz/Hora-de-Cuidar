export interface IBGEEstadoAPI {
  id: number;     
  sigla: string;  
  nome: string;   
}

export interface IBGEMunicipioAPI {
  id: number;         
  nome: string;       
  microrregiao: { mesorregiao: { UF: { sigla: string; id: number; nome: string } } };
}
