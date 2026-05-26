'use client';

import { useState } from 'react';
import type {
  InquiryAgentFormDraft,
  InquiryAgentMessage,
  InquiryAgentProductContext,
  InquiryAgentResult
} from '@nongyechuhai/ai';
import type { StorefrontProductCard } from '../../../lib/storefront';
import { InquiryAgent } from './inquiry-agent';

type RfqFormExperienceProps = {
  locale: string;
  products: StorefrontProductCard[];
  selectedProductSlug: string | null;
  defaultName: string;
  defaultEmail: string;
};

type FormState = {
  productSlug: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  quantityRequested: string;
  targetPrice: string;
  currency: string;
  requirements: string;
};

export function RfqFormExperience({
  locale,
  products,
  selectedProductSlug,
  defaultName,
  defaultEmail
}: RfqFormExperienceProps) {
  const isZh = locale === 'zh';
  const [formState, setFormState] = useState<FormState>({
    productSlug: selectedProductSlug ?? '',
    customerName: defaultName,
    customerCompany: '',
    customerEmail: defaultEmail,
    customerPhone: '',
    customerCountry: '',
    quantityRequested: '',
    targetPrice: '',
    currency: 'USD',
    requirements: ''
  });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [agentConversation, setAgentConversation] = useState('');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const selectedProduct = products.find((product) => product.slug === formState.productSlug);
  const selectedProductContext: InquiryAgentProductContext | null = selectedProduct
    ? {
        slug: selectedProduct.slug,
        name: selectedProduct.name,
        tradeModeLabel: selectedProduct.tradeModeLabel,
        categoryName: selectedProduct.categoryName,
        summary: selectedProduct.summary,
        priceLabel: selectedProduct.priceLabel,
        supplierName: selectedProduct.supplierName,
        supplierLocation: selectedProduct.supplierLocation
      }
    : null;
  const formDraft: InquiryAgentFormDraft = {
    customerName: formState.customerName || undefined,
    customerCompany: formState.customerCompany || undefined,
    customerEmail: formState.customerEmail || undefined,
    customerPhone: formState.customerPhone || undefined,
    customerCountry: formState.customerCountry || undefined,
    quantityRequested: formState.quantityRequested ? Number(formState.quantityRequested) : null,
    targetPrice: formState.targetPrice ? Number(formState.targetPrice) : null,
    currency: formState.currency || undefined,
    requirements: formState.requirements || undefined
  };

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setTouchedFields((current) => ({
      ...current,
      [field]: true
    }));

    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleAgentSync = (result: InquiryAgentResult, messages: InquiryAgentMessage[]) => {
    let syncedCount = 0;

    setFormState((current) => {
      const next = { ...current };

      const applyText = (field: keyof FormState, value: string | undefined, options?: { replaceUntouched?: boolean }) => {
        if (!value) {
          return;
        }

        const shouldReplace = options?.replaceUntouched && !touchedFields[field];
        if ((!current[field] && !touchedFields[field]) || shouldReplace) {
          if (next[field] !== value) {
            next[field] = value;
            syncedCount += 1;
          }
        }
      };

      const applyNumber = (field: 'quantityRequested' | 'targetPrice', value: number | null | undefined) => {
        if (typeof value !== 'number' || !Number.isFinite(value) || touchedFields[field]) {
          return;
        }

        const stringValue = String(value);
        if (next[field] !== stringValue) {
          next[field] = stringValue;
          syncedCount += 1;
        }
      };

      applyText('customerName', result.formDraft.customerName);
      applyText('customerCompany', result.formDraft.customerCompany);
      applyText('customerEmail', result.formDraft.customerEmail);
      applyText('customerPhone', result.formDraft.customerPhone);
      applyText('customerCountry', result.formDraft.customerCountry);
      applyText('currency', result.formDraft.currency, { replaceUntouched: true });
      applyText('requirements', result.formDraft.requirements, { replaceUntouched: true });
      applyNumber('quantityRequested', result.formDraft.quantityRequested);
      applyNumber('targetPrice', result.formDraft.targetPrice);

      return next;
    });

    setAgentConversation(JSON.stringify({
      updatedAt: new Date().toISOString(),
      readiness: result.readiness,
      missingFields: result.missingFields,
      briefingSummary: result.briefingSummary,
      briefing: result.briefing,
      selectedProduct: selectedProductContext,
      transcript: messages.slice(-12)
    }));

    setSyncMessage(syncedCount > 0
      ? (isZh ? `询盘助手已同步 ${syncedCount} 个字段到表单，您仍可继续手动修改。` : `The inquiry assistant synced ${syncedCount} field(s) into the form. You can still edit everything manually.`)
      : (isZh ? '询盘助手已更新买家简报，暂无新的表单字段可同步。' : 'The inquiry assistant updated the buyer brief. No new form fields needed syncing yet.'));
  };

  return (
    <>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="agentConversation" value={agentConversation} />

      <InquiryAgent
        locale={locale}
        formDraft={formDraft}
        selectedProduct={selectedProductContext}
        onSync={handleAgentSync}
      />

      {syncMessage ? (
        <div className="field field--full inquiry-agent-sync-note">
          <small>{syncMessage}</small>
        </div>
      ) : null}

      <div className="field field--full">
        <label htmlFor="productSlug">{isZh ? '目标产品' : 'Target product'}</label>
        <select
          id="productSlug"
          name="productSlug"
          value={formState.productSlug}
          onChange={(event) => handleFieldChange('productSlug', event.target.value)}
        >
          <option value="">{isZh ? '一般出口需求' : 'General export request'}</option>
          {products.map((product) => (
            <option key={product.slug} value={product.slug}>
              {product.name} · {product.tradeModeLabel}
            </option>
          ))}
        </select>
        <small>{isZh ? '选择最接近的当前产品线，或留空提交更广泛的出口需求。' : 'Choose the closest current showcase line, or leave blank for a broader export request.'}</small>
      </div>

      <div className="field">
        <label htmlFor="customerName">{isZh ? '联系人姓名' : 'Contact name'}</label>
        <input
          id="customerName"
          name="customerName"
          placeholder={isZh ? '张明' : 'Amelia Harper'}
          required
          type="text"
          value={formState.customerName}
          onChange={(event) => handleFieldChange('customerName', event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="customerCompany">{isZh ? '公司名称' : 'Company'}</label>
        <input
          id="customerCompany"
          name="customerCompany"
          placeholder={isZh ? '海港贸易公司' : 'Harbor Foods Trading'}
          type="text"
          value={formState.customerCompany}
          onChange={(event) => handleFieldChange('customerCompany', event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="customerEmail">{isZh ? '商务邮箱' : 'Business email'}</label>
        <input
          id="customerEmail"
          name="customerEmail"
          placeholder="buyer@company.com"
          required
          type="email"
          value={formState.customerEmail}
          onChange={(event) => handleFieldChange('customerEmail', event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="customerPhone">{isZh ? '电话/WhatsApp' : 'Phone / WhatsApp'}</label>
        <input
          id="customerPhone"
          name="customerPhone"
          placeholder="+65 ..."
          type="text"
          value={formState.customerPhone}
          onChange={(event) => handleFieldChange('customerPhone', event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="customerCountry">{isZh ? '目的地市场' : 'Destination market'}</label>
        <input
          id="customerCountry"
          name="customerCountry"
          placeholder={isZh ? '新加坡' : 'Singapore'}
          required
          type="text"
          value={formState.customerCountry}
          onChange={(event) => handleFieldChange('customerCountry', event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="quantityRequested">{isZh ? '目标数量' : 'Target quantity'}</label>
        <input
          id="quantityRequested"
          min="1"
          name="quantityRequested"
          placeholder="2000"
          type="number"
          value={formState.quantityRequested}
          onChange={(event) => handleFieldChange('quantityRequested', event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="targetPrice">{isZh ? '目标单价' : 'Target unit price'}</label>
        <input
          id="targetPrice"
          min="0"
          name="targetPrice"
          placeholder="135.00"
          step="0.01"
          type="number"
          value={formState.targetPrice}
          onChange={(event) => handleFieldChange('targetPrice', event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="currency">{isZh ? '货币' : 'Currency'}</label>
        <select
          id="currency"
          name="currency"
          value={formState.currency}
          onChange={(event) => handleFieldChange('currency', event.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CNY">CNY</option>
          <option value="SGD">SGD</option>
          <option value="AED">AED</option>
        </select>
      </div>

      <div className="field field--full">
        <label htmlFor="requirements">{isZh ? '需求说明' : 'Requirements'}</label>
        <textarea
          id="requirements"
          name="requirements"
          placeholder={isZh
            ? '描述规格、包装、目的地市场、预期交期及任何文档约束。'
            : 'Describe specifications, packaging, destination market, expected lead time, and any documentation constraints.'}
          required
          value={formState.requirements}
          onChange={(event) => handleFieldChange('requirements', event.target.value)}
        />
      </div>
    </>
  );
}