import type { Clerk } from '@clerk/types';

import { clerkCoreErrorContextProviderNotFound, clerkCoreErrorNoClerkSingleton } from '../../core/errors';

export function assertClerkSingletonExists(clerk: Clerk | undefined): asserts clerk is Clerk {
  if (!clerk) {
    clerkCoreErrorNoClerkSingleton();
  }
}

export function assertContextExists(contextVal: unknown, providerName: string): asserts contextVal {
  if (!contextVal) {
    clerkCoreErrorContextProviderNotFound(providerName);
  }
}

export function isRedirectForSSOFlow(clerk: Clerk, redirectUrl: string): boolean {
  const fapiUrl = clerk.publishableKey || clerk.frontendApi;

  const url = new URL(redirectUrl);
  const path = url.pathname;

  if (url.host === fapiUrl && ssoRedirectPaths.includes(path)) {
    return true;
  } else {
    return false;
  }
}

const ssoRedirectPaths: string[] = [
  '/oauth/authorize', // OAuth2 identify provider flow
];
