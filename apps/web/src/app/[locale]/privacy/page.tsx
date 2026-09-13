import { setRequestLocale } from 'next-intl/server';
import { highlandMetadata } from '../../../lib/highland';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return highlandMetadata(
    locale,
    { zh: '隐私说明', en: 'Privacy notice' },
    {
      zh: '了解联系 Farmetra 时的信息使用方式。',
      en: 'How information is used when you contact Farmetra.',
    },
    '/privacy',
  );
}
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const zh = locale === 'zh';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'export@farmetra.com';
  return (
    <main className="ft-main ft-container ft-privacy">
      <h1>{zh ? '隐私说明' : 'Privacy notice'}</h1>
      {(zh
        ? [
            [
              '联系信息',
              '当您通过邮件联系 Farmetra 时，您提供的姓名、企业、邮箱和咨询内容用于回复及相关业务沟通。请仅提供与咨询有关的信息。',
            ],
            [
              '邮件联系',
              '网站联系表单帮助您整理邮件内容，并打开您的邮件应用。邮件由您确认发送，表单本身不直接向服务器提交咨询内容。邮件内容也受您所使用邮件服务的处理方式影响。',
            ],
            [
              '查询与更正',
              '如需查询、更正或请求删除已经发送给我们的联系信息，请通过以下邮箱与我们联系。',
            ],
            [
              '适用范围',
              '本说明适用于本网站的产品展示与邮件联系页面。具体合作过程中的资料共享和保密安排，可由双方另行约定。',
            ],
          ]
        : [
            [
              'Contact information',
              'When you contact Farmetra by email, the name, company, email address and enquiry you provide are used to respond and communicate about your request. Please share only information relevant to your enquiry.',
            ],
            [
              'Contacting us by email',
              'The contact form helps prepare a message and opens your email application. You confirm sending the email; the form itself does not submit the enquiry directly to a server. Your email provider’s processing practices also apply.',
            ],
            [
              'Access and correction',
              'To ask about, correct or request deletion of contact information you have sent to us, please contact the email address below.',
            ],
            [
              'Scope',
              'This notice applies to this website’s product showcase and email contact pages. Information sharing and confidentiality for a specific partnership may be agreed separately.',
            ],
          ]
      ).map(([title, copy]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{copy}</p>
        </section>
      ))}
      <a href={`mailto:${email}`} className="ft-text-link">
        {email}
      </a>
    </main>
  );
}
