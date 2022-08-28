import React, { cloneElement, isValidElement, ReactNode } from 'react';

const ROUTE_PARAMETER_REGEX = /:(\w+)/g;
const QUERY_STRING_REGEXP = /\?[\w=&]+/g;
const URL_FRAGMENT = '([^\\/]+)';

export function throwError(message: string) {
  throw new Error(message);
}

export function isRouteComponent(element: React.ReactElement) {
  return element.props.path && element.props.element;
}

export function isValidChild(
  child: React.ReactNode,
): child is React.ReactElement {
  if (!isValidElement(child)) {
    return false;
  }

  if (!isRouteComponent(child)) {
    return false;
  }

  return true;
}

export function removeQueryString(routePath: string) {
  return routePath.replace(QUERY_STRING_REGEXP, '');
}

export function transformPathVariables(routePath: string) {
  const params: string[] = [];
  const parsedPath = routePath.replace(
    ROUTE_PARAMETER_REGEX,
    (_match: string, paramName: string) => {
      params.push(paramName);
      return URL_FRAGMENT;
    },
  );

  return {
    parsedPath,
    params,
  };
}

export function isMatchedRoute(parsedPath: string, pathname: string) {
  const pathRegExp = new RegExp(`^${parsedPath}$`);

  return pathRegExp.test(pathname);
}

export function getQueryString(search: string): {
  [key: string]: string;
} {
  if (!search) return {};

  return search
    .replace('?', '')
    .split('&')
    .reduce((acc, querystring) => {
      const [key, val] = querystring.split('=');
      return { ...acc, [key]: val };
    }, {});
}

export function getPathParams({
  currentPath,
  pathRegex,
  paramArray,
}: {
  currentPath: string;
  pathRegex: string;
  paramArray: string[];
}) {
  const paramsRegex = new RegExp(`^${pathRegex}$`);

  const match = currentPath.match(paramsRegex);

  if (!match) {
    return {};
  }

  match.shift();

  const result: {
    [key: string]: string;
  } = {};

  return match.reduce(
    (result, curr, idx) => {
      result[paramArray[idx]] = curr;

      return result;
    },
    { ...result },
  );
}

export function cloneChildren(
  children: ReactNode,
  locationInfo?: { pathname?: string; search?: string },
) {
  const cloneTarget = isValidElement(children) ? children : <>{children}</>;

  return cloneElement(cloneTarget, {
    key: locationInfo?.pathname,
    locationInfo,
  });
}
