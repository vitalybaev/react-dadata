/// <reference types="@testing-library/jest-dom/vitest" />
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import "./src/react-dadata.css";

afterEach(() => {
  cleanup();
});
