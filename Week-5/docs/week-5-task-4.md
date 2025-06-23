# Product Component Security Report

## Overview

This report analyzes the security issues found in the `Product` React component and documents the secure solutions that were applied. The focus areas are XSS, unsafe HTML rendering, input validation, navigation, and image source validation.

---

## 1. XSS Vulnerabilities

**Issue:**

```tsx
<div dangerouslySetInnerHTML={{ __html: product.description }} />
```

If `product.description` contains untrusted HTML, it can execute malicious scripts in the user's browser.

**Solution:**

- Sanitize HTML using [DOMPurify](https://github.com/cure53/DOMPurify):

```tsx
<div
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
/>
```

---

## 2. Unsafe HTML Rendering

**Issue:**

- Using `dangerouslySetInnerHTML` is risky and should be avoided unless necessary.

**Solution:**

- Always sanitize HTML if you must use `dangerouslySetInnerHTML`.
- Prefer rendering plain text when possible:

```tsx
<p>{product.description}</p>
```

---

## 3. Input Validation Issues

**Issue:**

- Directly using `product.id`, `product.title`, and `product.imageUrl` without validation can lead to security and functional bugs.

**Solution:**

- Validate and sanitize all props before use.
- Example for `product.id`:

```tsx
if (
  typeof product.id === 'number' ||
  /^[a-zA-Z0-9_-]+$/.test(String(product.id))
) {
  // safe to use
}
```

---

## 4. URL/Navigation Security

**Issue:**

```tsx
window.location.href = `/product/${product.id}`;
```

- Using unvalidated input in URLs can lead to open redirects or navigation to unintended locations.

**Solution:**

- Validate `product.id` before using it in navigation.
- Use React Router's `useNavigate` for safer navigation:

```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
// ...
if (
  typeof product.id === 'number' ||
  /^[a-zA-Z0-9_-]+$/.test(String(product.id))
) {
  navigate(`/product/${product.id}`);
}
```

---

## 5. Image Source Validation

**Issue:**

```tsx
<img src={product.imageUrl || ''} alt={product.title} />
```

- If `product.imageUrl` is user-controlled, it could be a malicious or invalid URL.

**Solution:**

- Validate the image URL before rendering:

```tsx
const isValidImageUrl = (url: string) =>
  /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/[\w./-]*)?$/i.test(url);
<img
  src={
    isValidImageUrl(product.imageUrl) ? product.imageUrl : '/default-image.png'
  }
  alt={product.title}
/>;
```

---

## Secure Product Component Example

```tsx
import React from 'react';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../../../models';

interface IProps {
  product: IProduct;
}

const isValidImageUrl = (url: string) =>
  /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/[\w./-]*)?$/i.test(url);

const Product: React.FC<IProps> = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>{product.title}</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(product.description),
        }}
      />
      <img
        src={
          isValidImageUrl((product as any).imageUrl)
            ? (product as any).imageUrl
            : '/default-image.png'
        }
        alt={product.title}
      />
      <button
        onClick={() => {
          if (
            typeof product.id === 'number' ||
            /^[a-zA-Z0-9_-]+$/.test(String(product.id))
          ) {
            navigate(`/product/${product.id}`);
          }
        }}
      >
        View Details
      </button>
    </div>
  );
};
```

---

## Summary

- All major security issues in the Product component have been addressed.
- The component now sanitizes HTML, validates all user input, and uses safe navigation and image rendering patterns.
- These changes help prevent XSS, open redirects, and broken or malicious images, making the app safer for users.
