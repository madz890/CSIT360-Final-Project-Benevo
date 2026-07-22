import { useState } from "react";

export default function useFormState(initialState) {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return [form, handleChange, setForm];
}
