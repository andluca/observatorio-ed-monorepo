import Link from "next/link";

export function WebsiteFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sobre */}
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Sobre o Observatório</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              O Observatório da Extrema Direita Latino-Americana é uma iniciativa acadêmica 
              dedicada ao estudo e análise dos movimentos de extrema direita na região.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Contato</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>observatorio@unicamp.br</p>
              <p>Centro de Estudos Marxistas (CEMARX)</p>
              <p>Universidade Estadual de Campinas</p>
            </div>
          </div>

          {/* Instituições */}
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Instituições</h3>
            <div className="flex flex-col space-y-4">
              <div className="text-sm text-gray-600">
                <p className="font-bold text-gray-800">CEMARX</p>
                <p>Centro de Estudos Marxistas</p>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-bold text-gray-800">UNICAMP</p>
                <p>Universidade Estadual de Campinas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Observatório da Extrema Direita Latino-Americana. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
