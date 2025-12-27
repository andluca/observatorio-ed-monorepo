export const metadata = {
  title: 'Sobre o Observatório | OEDLA',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8 border-l-8 border-[#FFC700] pl-6">
          Quem Somos
        </h1>

        <div className="prose prose-lg text-gray-700 text-justify">
          <p>
            O <strong>Observatório da Extrema-Direita Latino-americana (OEDLA)</strong>, registrado no Diretório de Grupos de Pesquisa (DGP) do CNPq desde 12 de agosto de 2025, é sediado no Centro de Estudos Marxistas (CEMARX) da Unicamp.
          </p>
          <p>
            Sob a coordenação do professor <strong>André Kaysel Velasco e Cruz</strong>, o grupo dedica-se ao estudo, pesquisa científica e difusão do conhecimento acerca das extremas-direitas contemporâneas na América Latina e suas conexões transnacionais.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Nossa Origem</h3>
          <p>
            O grupo nasceu do projeto <em>“A Sagrada Família da Extrema-Direita ao Sul da América: uma análise comparada de Argentina, Bolívia, Brasil e Chile (2015-2025)”</em>, financiado pelo FAEPEX/Unicamp. O escopo inicial foi o estudo comparado do discurso ideológico das principais lideranças da extrema-direita na região entre a crise da “maré rosa” e a ascensão de novas expressões radicalizadas.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Nossa Missão de Difusão</h3>
          <p>
            O OEDLA atua na difusão dos seguintes conteúdos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Divulgação da produção científica da equipe (artigos, capítulos, teses).</li>
            <li>Difusão de pesquisas externas sobre a extrema-direita latino-americana.</li>
            <li>Parcerias com outros observatórios e grupos de pesquisa.</li>
            <li>Notas curtas e informes de conjuntura política.</li>
            <li>Monitoramento da imprensa e meios de comunicação.</li>
            <li>Repositório de fontes (discursos, documentos e material audiovisual).</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Atividades</h3>
          <p>
            Além da pesquisa, promovemos grupos de estudos mensais dedicados à leitura de obras das Ciências Sociais, Ciência Política e História. Também organizamos seminários públicos no IFCH-Unicamp e estamos preparando o lançamento de um podcast com entrevistas a pesquisadores da área.
          </p>
        </div>

      </div>
    </div>
  );
}