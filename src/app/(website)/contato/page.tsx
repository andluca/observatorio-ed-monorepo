import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Lado Esquerdo - Info */}
          <div className="p-10 md:w-3/5">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Entre em Contato</h1>
            <p className="text-gray-600 mb-8">
              Tem interesse em colaborar com o OEDLA ou deseja mais informações sobre nossas pesquisas? Fale conosco.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-50 rounded-lg text-[#FFC700]">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600">observatorio@unicamp.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-50 rounded-lg text-[#FFC700]">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Telefone</h3>
                  <p className="text-gray-600">(19) 3521-6250</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-50 rounded-lg text-[#FFC700]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Endereço</h3>
                  <p className="text-gray-600 text-sm">
                    Centro de Estudos Marxistas (CEMARX)<br/>
                    Instituto de Filosofia e Ciências Humanas (IFCH)<br/>
                    Universidade Estadual de Campinas<br/>
                    Rua Cora Coralina, 100 - Cidade Universitária<br/>
                    13083-896 - Campinas, SP
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Mapa ou Imagem Institucional */}
          <div className="bg-gray-900 md:w-2/5 p-10 text-white flex flex-col justify-center">
             <h3 className="font-bold text-xl mb-4 text-[#FFC700]">Participe</h3>
             <p className="text-gray-300 text-sm leading-relaxed">
               O OEDLA está aberto ao ingresso de docentes, pós-graduandos e graduandos interessados em colaborar para compreendermos este fenômeno complexo.
             </p>
             <div className="mt-8 pt-8 border-t border-gray-700">
               <p className="font-bold mb-2">Siga-nos</p>
               <div className="flex gap-4">
                 {/* Ícones de redes sociais aqui */}
                 <span className="text-gray-400 text-sm">Em breve nas redes sociais</span>
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}