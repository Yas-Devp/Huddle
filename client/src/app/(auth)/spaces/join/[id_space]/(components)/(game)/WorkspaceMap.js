"use client";

import { useAuth } from "@/components/context/auth";
import { useEffect, useRef } from "react";

export default function WorkspaceMap({ people = [] }) {
  const mapContainerRef = useRef(null);
  const gameRef = useRef(null);
  const peopleRef = useRef(people);
  const { user } = useAuth();
  const name = user?.nom + " " + user?.prenom;

  // Keep people updated
  useEffect(() => {
    peopleRef.current = people;

    const scene = gameRef.current?.scene.getScene("WorkspaceScene");

    if (scene?.scene.isActive()) {
      scene.updatePeople(people);
    }
  }, [people]);

  // Initialize Phaser in the browser only
  useEffect(() => {
    let game;

    async function initializeGame() {
      if (!mapContainerRef.current || gameRef.current) return;

      // Import Phaser only in the browser
      const Phaser = (await import("phaser")).default;

      // Import your scene only in the browser
      const { WorkspaceScene } = await import("./WorkspaceScene");

      if (!mapContainerRef.current) return;

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: mapContainerRef.current,
        width: "100%",
        height: "100%",
        backgroundColor: "#1e293b",
        pixelArt: true,

        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
        },

        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },

        scene: [],
      });

      gameRef.current = game;

      game.scene.add("WorkspaceScene", new WorkspaceScene(name), true, {
        people: peopleRef.current,
      });
    }

    initializeGame();

    return () => {
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--workspace-canvas)]">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}
