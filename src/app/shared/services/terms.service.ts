import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TermsService {
  
  constructor() { }

  showTermsOfUse(): void {
    Swal.fire({
      title: 'Termos de Uso',
      html: this.getTermsOfUseHtml(),
      width: '90%',
      heightAuto: true,
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Entendi',
      confirmButtonColor: '#FF8800'
    });
  }

  showPrivacyPolicy(): void {
    Swal.fire({
      title: 'Política de Privacidade',
      html: this.getPrivacyPolicyHtml(),
      width: '90%',
      heightAuto: true, 
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Entendi',
      confirmButtonColor: '#FF8800'
    });
  }

  getTermsOfUseHtml(): string {
    return `
      <div class="terms-container font-family-poppins text-start text-white">
        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">1. Apresentação</h4>
          <p class="mb-3">Bem-vindo ao aplicativo DWA, desenvolvido para a gestão de treinos e alunos de academias. Ao utilizar este aplicativo, você concorda com os presentes Termos de Uso. Caso discorde de qualquer condição, não utilize o aplicativo.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">2. Funcionalidades</h4>
          <p class="mb-3">O aplicativo DWA oferece funcionalidades como:</p>
          <ul class="ps-4 mb-3">
            <li class="mb-2">Cadastro de alunos e gestão de treinos;</li>
            <li class="mb-2">Personalização de rotinas de treino;</li>
            <li class="mb-2">Acompanhamento de resultados e relatórios.</li>
          </ul>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">3. Uso do Aplicativo</h4>
          <p class="mb-3"><strong>Responsabilidades do Usuário:</strong></p>
          <ul class="ps-4 mb-3">
            <li class="mb-2">Fornecer informações precisas e atualizadas;</li>
            <li class="mb-2">Não compartilhar suas credenciais de acesso com terceiros.</li>
          </ul>
          <p class="mb-3"><strong>Restrições:</strong></p>
          <p class="mb-3">É proibido o uso do aplicativo para fins ilegais ou que infrinjam direitos de terceiros.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">4. Alterações nos Termos</h4>
          <p class="mb-3">Os Termos de Uso podem ser alterados a qualquer momento. O usuário será informado sobre mudanças por meio de uma mensagem exibida no aplicativo. É responsabilidade do usuário revisar as atualizações.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">5. Limitação de Responsabilidade</h4>
          <p class="mb-3">Não nos responsabilizamos por:</p>
          <ul class="ps-4 mb-3">
            <li class="mb-2">Danos decorrentes do uso indevido do aplicativo;</li>
            <li class="mb-2">Erros ou interrupções causados por terceiros.</li>
          </ul>
        </div>
      </div>
    `;
  }

  getPrivacyPolicyHtml(): string {
    return `
      <div class="terms-container font-family-poppins text-start text-white">
        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">1. Introdução</h4>
          <p class="mb-3">O aplicativo DWA respeita sua privacidade e protege seus dados pessoais em conformidade com a LGPD (Lei Geral de Proteção de Dados – Lei nº 13.709/2018).</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">2. Dados Pessoais Coletados</h4>
          <p class="mb-3">Coletamos os seguintes dados:</p>
          <ul class="ps-4 mb-3">
            <li class="mb-2">Nome, CPF, e-mail e telefone;</li>
            <li class="mb-2">Peso, altura, IMC e dados de saúde (futuramente).</li>
          </ul>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">3. Finalidade do Tratamento dos Dados</h4>
          <p class="mb-3">Seus dados são utilizados para:</p>
          <ul class="ps-4 mb-3">
            <li class="mb-2">Personalização de treinos;</li>
            <li class="mb-2">Acompanhamento de resultados e emissão de relatórios;</li>
            <li class="mb-2">Envio de notificações e comunicações relevantes.</li>
          </ul>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">4. Compartilhamento de Dados</h4>
          <p class="mb-3">Dados podem ser compartilhados com academias parceiras para fins de gestão e relatórios, caso necessário. No momento, não realizamos transferência internacional de dados.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">5. Segurança e Armazenamento</h4>
          <p class="mb-3">Adotamos medidas de segurança como:</p>
          <ul class="ps-4 mb-3">
            <li class="mb-2">Senhas criptografadas;</li>
            <li class="mb-2">Banco de dados protegido.</li>
          </ul>
          <p class="mb-3">Os dados são armazenados até o usuário se tornar inativo ou solicitar exclusão, mantendo apenas o histórico necessário para fins de relatórios.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">6. Direitos dos Usuários</h4>
          <p class="mb-3">O usuário pode acessar, corrigir ou excluir seus dados diretamente pelo aplicativo. Em caso de dúvidas, entre em contato pelo e-mail: suporte@dwa.com.br.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">7. Uso de Cookies e Tecnologias de Rastreamento</h4>
          <p class="mb-3">No momento, o aplicativo não utiliza cookies ou outras tecnologias de rastreamento.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">8. Menores de Idade</h4>
          <p class="mb-3">Permitimos o cadastro de menores de idade mediante consentimento dos responsáveis. Esta funcionalidade está em desenvolvimento e seguirá as diretrizes legais.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">9. Alterações na Política de Privacidade</h4>
          <p class="mb-3">Esta política pode ser atualizada. O usuário será informado sobre mudanças por meio de mensagens no aplicativo.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">10. Base Legal para o Tratamento de Dados</h4>
          <p class="mb-3">Os dados pessoais são tratados com base no consentimento dos usuários.</p>
        </div>

        <div class="terms-section rounded">
          <h4 class="fw-semibold mb-3">11. Contato</h4>
          <p class="mb-3">Para mais informações, entre em contato com o controlador do aplicativo pelo e-mail: suporte@dwa.com.br.</p>
        </div>
      </div>
    `;
  }
} 