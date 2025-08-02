import z from 'zod';

const validSizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const productSchema = z.object({
  _id: z.string().optional(),
  bestseller: z.boolean(),
  category: z.string().min(1, 'A categoria é obrigatória.'),
  date: z
    .number()
    .int()
    .positive('A data precisa ser um valor numérico positivo.'),
  description: z
    .string()
    .min(10, 'A descrição precisa ter no mínimo 10 caracteres.'),
  name: z.string().min(3, 'O nome precisa ter no mínimo 3 caracteres.'),
  image: z
    .array(z.string().url('Cada imagem deve ser uma URL válida.'))
    .min(1, 'O produto precisa ter pelo menos uma imagem.'),
  price: z.number().positive('O preço precisa ser um valor positivo.'),
  sizes: z
    .array(z.enum(validSizes))
    .min(1, 'O produto precisa ter pelo menos um tamanho.'),
  subCategory: z.string().min(1, 'A subcategoria é obrigatória.'),
});

export type ProductType = z.infer<typeof productSchema>;
