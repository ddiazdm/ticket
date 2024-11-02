import {
  LineaTicket,
  Producto,
  ResultadoLineaTicket,
  ResultadoTotalTicket,
  TotalPorTipoIva,
  TicketFinal,
} from "./interface/ticket";

import { productos } from "./data";

export const calculaIVAproducto = (producto: Producto): number => {
  switch (producto.tipoIva) {
    case "general":
      return producto.precio * 0.21;
    case "reducido":
      return producto.precio * 0.1;
    case "superreducidoA":
      return producto.precio * 0.05;
    case "superreducidoB":
      return producto.precio * 0.04;
    case "superreducidoC":
      return producto.precio * 0.04;
    case "sinIva":
      return 0;
    default:
      return 0;
  }
};

export const calculaLineaTicket = (
  linea: LineaTicket[]
): ResultadoLineaTicket[] => {
  return linea.map((linea) => {
    const iva = calculaIVAproducto(linea.producto);
    const precioSinIva = roundToTwoDecimals(
      linea.producto.precio * linea.cantidad
    );
    const precioConIva = roundToTwoDecimals(
      (linea.producto.precio + iva) * linea.cantidad
    );

    return {
      nombre: linea.producto.nombre,
      cantidad: linea.cantidad,
      precionSinIva: precioSinIva,
      tipoIva: linea.producto.tipoIva,
      precioConIva: precioConIva,
    };
  });
};

export const calculaTotalTicket = (
  lineas: ResultadoLineaTicket[]
): ResultadoTotalTicket => {
  return lineas.reduce(
    (acc, linea) => ({
      totalSinIva: roundToTwoDecimals(acc.totalSinIva + linea.precionSinIva),
      totalConIva: roundToTwoDecimals(acc.totalConIva + linea.precioConIva),
      totalIva: roundToTwoDecimals(
        acc.totalIva + (linea.precioConIva - linea.precionSinIva)
      ),
    }),
    { totalSinIva: 0, totalConIva: 0, totalIva: 0 }
  );
};

const roundToTwoDecimals = (num: number): number => {
  return Number(num.toFixed(2));
};

export const calculaTotalPorTipoIva = (
  lineas: ResultadoLineaTicket[]
): TotalPorTipoIva[] => {
  return lineas.reduce((acc, linea) => {
    const ivaLinea = roundToTwoDecimals(
      linea.precioConIva - linea.precionSinIva
    );
    const tipoExistente = acc.find((item) => item.tipoIva === linea.tipoIva);

    if (tipoExistente) {
      tipoExistente.cuantia = roundToTwoDecimals(
        tipoExistente.cuantia + ivaLinea
      );
    } else {
      acc.push({
        tipoIva: linea.tipoIva,
        cuantia: ivaLinea,
      });
    }

    return acc;
  }, [] as TotalPorTipoIva[]);
};

export const createTicketFinal = (lineasTicket: LineaTicket[]): TicketFinal => {
  const lineas = calculaLineaTicket(lineasTicket);
  const total = calculaTotalTicket(lineas);
  const desgloseIva = calculaTotalPorTipoIva(lineas);

  return {
    lineas,
    total,
    desgloseIva,
  };
};

const renderTicket = (ticket: TicketFinal): void => {
  const ticketLines =
    document.querySelector<HTMLTableSectionElement>("#ticket-lines");
  const iva = document.querySelector<HTMLUListElement>("#iva-list");
  const total = document.querySelector<HTMLDivElement>("#total");

  if (!ticketLines || !iva || !total) return;

  ticketLines.innerHTML = ticket.lineas
    .map(
      (linea) => `
      <tr>
        <td>${linea.nombre}</td>
        <td>${linea.cantidad}</td>
        <td>${linea.precionSinIva}€</td>
        <td>${linea.precioConIva}€</td>
      </tr>
    `
    )
    .join("");

  iva.innerHTML = ticket.desgloseIva
    .map((iva) => `<li>IVA ${iva.tipoIva}: ${iva.cuantia}€</li>`)
    .join("");

  total.innerHTML = `
    <p>Total sin IVA: ${ticket.total.totalSinIva}€</p>
    <p>Total IVA: ${ticket.total.totalIva}€</p>
    <p>Total con IVA: ${ticket.total.totalConIva}€</p>
  `;
};

const ticket = createTicketFinal(productos);
renderTicket(ticket);
