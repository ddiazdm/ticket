import {
  calculaIVAproducto,
  calculaTotalPorTipoIva,
  calculaLineaTicket,
  calculaTotalTicket,
  createTicketFinal,
} from "./main";
import {
  Producto,
  LineaTicket,
  ResultadoLineaTicket,
} from "./interface/ticket";

describe("calculaIVAproducto", () => {
  it("Calculo del IVA del producto", () => {
    const producto: Producto = {
      nombre: "Producto 1",
      precio: 10,
      tipoIva: "general",
    };
    const result = calculaIVAproducto(producto);
    expect(result).toBe(2.1);
  });
});

describe("calculaLineaTicket", () => {
  it("Calcula linea del ticket por producto", () => {
    const lineasTicket: LineaTicket[] = [
      {
        producto: {
          nombre: "Producto 1",
          precio: 10,
          tipoIva: "general",
        },
        cantidad: 1,
      },
      {
        producto: {
          nombre: "Producto 2",
          precio: 10,
          tipoIva: "general",
        },
        cantidad: 1,
      },
    ];
    const result = calculaLineaTicket(lineasTicket);
    expect(result).toEqual([
      {
        nombre: "Producto 1",
        cantidad: 1,
        precionSinIva: 10,
        tipoIva: "general",
        precioConIva: 12.1,
      },
      {
        nombre: "Producto 2",
        cantidad: 1,
        precionSinIva: 10,
        tipoIva: "general",
        precioConIva: 12.1,
      },
    ]);
  });
});

describe("calculaTotalTicket", () => {
  it("Calculo total del ticket", () => {
    const lineas: ResultadoLineaTicket[] = [
      {
        nombre: "Producto 1",
        cantidad: 2,
        precionSinIva: 20,
        tipoIva: "general",
        precioConIva: 24.2,
      },
      {
        nombre: "Producto 2",
        cantidad: 1,
        precionSinIva: 10,
        tipoIva: "reducido",
        precioConIva: 11,
      },
    ];
    const result = calculaTotalTicket(lineas);
    expect(result).toEqual({
      totalSinIva: 30,
      totalConIva: 35.2,
      totalIva: 5.2,
    });
  });
});

describe("calculaTotalPorTipoIva", () => {
  it("calculo del total por tipo de IVA", () => {
    const lineas: ResultadoLineaTicket[] = [
      {
        nombre: "Producto 1",
        cantidad: 2,
        precionSinIva: 20,
        tipoIva: "general",
        precioConIva: 24.2,
      },
      {
        nombre: "Producto 2",
        cantidad: 1,
        precionSinIva: 10,
        tipoIva: "reducido",
        precioConIva: 11,
      },
    ];

    const result = calculaTotalPorTipoIva(lineas);
    expect(result).toEqual([
      { tipoIva: "general", cuantia: 4.2 },
      { tipoIva: "reducido", cuantia: 1 },
    ]);
  });

  it("Calculo del ticket final", () => {
    const lineasTicket: LineaTicket[] = [
      {
        producto: {
          nombre: "Producto 1",
          precio: 10,
          tipoIva: "general",
        },
        cantidad: 2,
      },
      {
        producto: {
          nombre: "Producto 2",
          precio: 10,
          tipoIva: "reducido",
        },
        cantidad: 1,
      },
    ];

    const result = createTicketFinal(lineasTicket);

    expect(result).toEqual({
      lineas: [
        {
          nombre: "Producto 1",
          cantidad: 2,
          precionSinIva: 20,
          tipoIva: "general",
          precioConIva: 24.2,
        },
        {
          nombre: "Producto 2",
          cantidad: 1,
          precionSinIva: 10,
          tipoIva: "reducido",
          precioConIva: 11,
        },
      ],
      total: {
        totalSinIva: 30,
        totalConIva: 35.2,
        totalIva: 5.2,
      },
      desgloseIva: [
        { tipoIva: "general", cuantia: 4.2 },
        { tipoIva: "reducido", cuantia: 1 },
      ],
    });
  });
});
