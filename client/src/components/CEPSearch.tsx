import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";

interface CEPSearchProps {
  onAddressFound?: (address: {
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => void;
}

export default function CEPSearch({ onAddressFound }: CEPSearchProps) {
  const [cep, setCep] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const viacepQuery = trpc.viacep.getAddressByCEP.useQuery(
    { cep },
    { enabled: false }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cep.trim()) {
      toast.error("Digite um CEP");
      return;
    }

    setIsLoading(true);

    try {
      const result = await viacepQuery.refetch();

      if (result.data?.success && result.data.data) {
        toast.success("CEP encontrado!");
        onAddressFound?.(result.data.data);
      } else {
        toast.error(result.data?.error || "CEP não encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP");
      console.error("CEP search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    // Formata enquanto digita: XX.XXX-XXX
    if (value.length > 5) {
      value = `${value.slice(0, 2)}.${value.slice(2, 5)}-${value.slice(5)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}.${value.slice(2)}`;
    }

    setCep(value);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
          <input
            type="text"
            value={cep}
            onChange={handleInputChange}
            placeholder="Digite seu CEP (ex: 01310-100)"
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-cyan-400/30 focus:border-cyan-400 focus:outline-none transition bg-white/5 text-white placeholder-gray-400"
            style={{ fontFamily: "'Inter', sans-serif" }}
            maxLength={12}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || cep.replace(/\D/g, "").length !== 8}
          className="px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
            fontFamily: "'Sora', sans-serif",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Buscando...
            </>
          ) : (
            "Ver Planos"
          )}
        </button>
      </div>
    </form>
  );
}
