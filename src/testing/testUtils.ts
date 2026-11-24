import type { ReactTestInstance } from 'react-test-renderer';

export function findAllByTestId(root: ReactTestInstance, testID: string): ReactTestInstance[] {
  return root.findAll(node => node.props.testID === testID);
}

export function queryByTestId(root: ReactTestInstance, testID: string): ReactTestInstance | null {
  return findAllByTestId(root, testID)[0] ?? null;
}

export function pressByTestId(root: ReactTestInstance, testID: string) {
  const target = findAllByTestId(root, testID).find(node => typeof node.props.onPress === 'function');
  if (!target) {
    throw new Error(`No pressable with testID ${testID}`);
  }
  target.props.onPress();
}

export function textContent(node: ReactTestInstance): string {
  return node
    .findAll(child => (child.type as unknown) === 'Text')
    .flatMap(child => child.children)
    .filter(child => typeof child === 'string')
    .join('');
}
