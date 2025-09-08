import { format, parse } from "date-fns";

export const parseDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
        throw new Error("Fecha no válida");
    }

    return parse(dateString, "dd-MM-yyyy", new Date());
};

export const formatDate = (date) => (date ? format(date, "dd-MM-yyyy") : null);