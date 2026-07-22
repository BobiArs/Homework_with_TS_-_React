import { useForm } from "react-hook-form";

interface SearchFormProps {
  onSearch: (query: string) => void;
}

interface FormData {
  query: string;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const queryValue = watch("query");
  const onSubmit = (data: FormData) => {
    onSearch(data.query.trim());
  };

  const handleReset = () => {
    reset();
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-lg mx-auto gap-2 mb-8"
    >
      <input
        type="text"
        placeholder="Введіть ім'я актора..."
        {...register("query", { required: false })}
        className="flex-1 px-4 py-2 border rounded-md outline-none focus:border-blue-500 transition"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition disabled:opacity-50"
      >
        Пошук
      </button>

      {queryValue && (
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
        >
          Скинути
        </button>
      )}
    </form>
  );
}
