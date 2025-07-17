export const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
