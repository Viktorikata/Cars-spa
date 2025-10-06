export type Car = {
  id: number;
  name: string;
  model: string;
  year: number;
  color: string;
  price: number;
  latitude: number;
  longitude: number;
};

export type CarForm = {
  name: string;
  model: string;
  color: string;
  year: string;       
  price: string;      
  latitude: string;   
  longitude: string;  
};

export type SortKey = "year" | "price" | null;
export type SortOrder = "asc" | "desc";
