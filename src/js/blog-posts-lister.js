document.addEventListener("DOMContentLoaded", function () {
  const blogItems = document.querySelectorAll('.blog-item');
  Array.from(blogItems).forEach(blogItem => {
    const linkElement = getBlogItemLinkElement(blogItem);
    if (!linkElement) return;

    reduceHeadingLevels(blogItem);

    const href = linkElement.getAttribute('href');
    linkElement.style.display = 'none';
    wrapBlogItemWithLink(blogItem, href);
  });
});

function getBlogItemLinkElement(blogItem) {
  return blogItem.querySelector('.blog-item-content').firstChild;
}

function wrapBlogItemWithLink(blogItem, href) {
  const anchor = document.createElement('a');
  anchor.className = 'blog-item-link-wrapper';
  anchor.href = href;
  anchor.appendChild(blogItem.cloneNode(true));
  blogItem.parentElement.appendChild(anchor);
  blogItem.remove();
}

function reduceHeadingLevels(blogItem) {
  const increase = 2;
  const minLevel = 1;
  const maxLevel = 4;
  const headings = Array.from(blogItem.querySelectorAll('h1, h2, h3, h4'));
  const sidebar = document.querySelector('nav.sidebar');
  headings.forEach(heading => {
    const level = parseInt(heading.tagName[1]);
    if (level >= minLevel && level <= maxLevel) {
      const newHeading = document.createElement(`h${level + increase}`);
      newHeading.innerHTML = heading.innerHTML;
      Array.from(heading.attributes).forEach(attr => {
        newHeading.setAttribute(attr.name, attr.value);
      });
      heading.parentNode.replaceChild(newHeading, heading);
    }

    sidebar?.querySelector(`li[data-target-id="${heading.id}"]`)?.remove();
  });
}
