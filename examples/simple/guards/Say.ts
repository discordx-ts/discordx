export function Say(text: string) {
  return () => {
    console.log(text);
    return true;
  };
}
