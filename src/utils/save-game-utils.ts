export const saveGame = (scene: string) => {
  localStorage.setItem("currentScene", scene);
};

export const loadGame = () => {
  const currentScene = localStorage.getItem("currentScene");
  return currentScene;
};
