// components/ErrorMessage.jsx
import { motion } from "framer-motion";

export function ErrorMessage({ message } : { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="p-2 rounded-md bg-destructive/15 text-destructive font-medium text-center"
    >
      {message}
    </motion.div>
  );
}