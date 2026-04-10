import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export function SettingsEditor() {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "contact">("whatsapp");
  
  // WhatsApp settings
  const [phoneNumber, setPhoneNumber] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [buttonMessages, setButtonMessages] = useState({
    hero: "",
    plans: "",
    celular: "",
    streaming: "",
  });

  // Contact settings
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");

  const getWhatsAppQuery = trpc.settings.getWhatsApp.useQuery();
  const getContactEmailQuery = trpc.settings.getContactEmail.useQuery();
  const updateWhatsAppMutation = trpc.settings.updateWhatsApp.useMutation();
  const updateContactEmailMutation = trpc.settings.updateContactEmail.useMutation();

  // Load WhatsApp settings
  useEffect(() => {
    if (getWhatsAppQuery.data) {
      setPhoneNumber((getWhatsAppQuery.data as any).phoneNumber || "");
      setDefaultMessage((getWhatsAppQuery.data as any).defaultMessage || "");
      setButtonMessages((getWhatsAppQuery.data as any).buttons || {});
    }
  }, [getWhatsAppQuery.data]);

  // Load Contact settings
  useEffect(() => {
    if (getContactEmailQuery.data) {
      setContactEmail((getContactEmailQuery.data as any).email || "");
      setContactSubject((getContactEmailQuery.data as any).subject || "");
    }
  }, [getContactEmailQuery.data]);

  const handleSaveWhatsApp = async () => {
    try {
      await updateWhatsAppMutation.mutateAsync({
        phoneNumber,
        defaultMessage,
        buttons: buttonMessages,
      });
      toast.success("Configurações de WhatsApp salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações de WhatsApp");
    }
  };

  const handleSaveContactEmail = async () => {
    try {
      await updateContactEmailMutation.mutateAsync({
        email: contactEmail,
        subject: contactSubject,
      });
      toast.success("Configurações de email salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações de email");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "whatsapp"
              ? "border-b-2 border-cyan-500 text-cyan-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          WhatsApp
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "contact"
              ? "border-b-2 border-cyan-500 text-cyan-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Email de Contato
        </button>
      </div>

      {/* WhatsApp Settings */}
      {activeTab === "whatsapp" && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações de WhatsApp</CardTitle>
            <CardDescription>
              Configure o número de WhatsApp e mensagens para cada botão do site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold mb-2">Número de WhatsApp</label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="5521986961362"
                className="max-w-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: código do país + DDD + número (sem caracteres especiais)
              </p>
            </div>

            {/* Default Message */}
            <div>
              <label className="block text-sm font-semibold mb-2">Mensagem Padrão</label>
              <Input
                value={defaultMessage}
                onChange={(e) => setDefaultMessage(e.target.value)}
                placeholder="Vim através do site de telecom do Alexandre"
                className="max-w-md"
              />
            </div>

            {/* Button Messages */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Mensagens por Botão</label>
              
              {Object.entries(buttonMessages).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                    Botão {key}
                  </label>
                  <Input
                    value={value}
                    onChange={(e) =>
                      setButtonMessages({ ...buttonMessages, [key]: e.target.value })
                    }
                    placeholder={`Mensagem para botão ${key}`}
                    className="max-w-md"
                  />
                </div>
              ))}
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveWhatsApp}
              disabled={updateWhatsAppMutation.isPending}
              className="gap-2"
            >
              {updateWhatsAppMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contact Email Settings */}
      {activeTab === "contact" && (
        <Card>
          <CardHeader>
            <CardTitle>Email de Contato</CardTitle>
            <CardDescription>
              Configure o email que receberá mensagens do formulário de contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email para Receber Mensagens</label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="seu@email.com"
                className="max-w-md"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold mb-2">Assunto do Email</label>
              <Input
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Nova mensagem de contato - MelhoresPlanos.net"
                className="max-w-md"
              />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveContactEmail}
              disabled={updateContactEmailMutation.isPending}
              className="gap-2"
            >
              {updateContactEmailMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
