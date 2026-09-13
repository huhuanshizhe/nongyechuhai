const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    menu.focus();
  }
});
document.querySelectorAll('[data-filter]').forEach((button) =>
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document
      .querySelectorAll('[data-filter]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.hidden = category !== '全部' && category !== card.dataset.category;
      if (!card.hidden) count++;
    });
    document.querySelector('#filter-status').textContent =
      `当前显示 ${count} 个特色品类`;
  }),
);
document.querySelector('#download-checklist')?.addEventListener('click', () => {
  const text =
    '青藏高原农产品食品出海平台\n企业合作资料清单\n\n1. 企业与联系人\n企业名称、所在地、联系人、业务角色、经营范围。\n\n2. 产品与供应\n产品名称、规格、包装、产季、供货方式、可沟通的数量范围。\n\n3. 图片与品牌\n产品、包装、产地图片及品牌和图片使用授权情况。\n\n4. 文件与目标\n可提供的检测认证资料、已有出口经验、希望进入的市场。\n\n首次沟通请仅提供概要。敏感资料在双方确认后通过约定渠道交换。\n具体展示和服务范围以合作协议为准。';
  const url = URL.createObjectURL(
    new Blob(['\ufeff' + text], { type: 'text/plain;charset=utf-8' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = '企业合作资料清单.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const form = document.querySelector('#cooperation-form');
if (form) {
  const requested = new URLSearchParams(location.search).get('type');
  if (['enterprise', 'regional', 'supply', 'investment'].includes(requested))
    form.elements.type.value = requested;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const get = (name) => String(values.get(name) || '').trim();
    const type = form.elements.type.selectedOptions[0].textContent;
    const subject = `产业合作 | ${type} | ${get('company')}`;
    const body = `合作方向：${type}\n企业 / 机构：${get('company')}\n联系人：${get('name')}\n邮箱：${get('email')}\n电话：${get('phone')}\n地区：${get('region')}\n\n合作需求：\n${get('message')}`;
    document.querySelector('#brief-text').textContent =
      `收件人：${form.dataset.email}\n主题：${subject}\n\n${body}`;
    document.querySelector('#brief-preview').hidden = false;
    document.querySelector('#copy-status').textContent = '';
    if (event.submitter?.value !== 'preview')
      location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  document.querySelector('#copy-brief').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(
        document.querySelector('#brief-text').textContent,
      );
      document.querySelector('#copy-status').textContent =
        '已复制。请粘贴到邮件中发送。';
    } catch {
      document.querySelector('#copy-status').textContent =
        '请选中上方内容手动复制。';
    }
  });
}
