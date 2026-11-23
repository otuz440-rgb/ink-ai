
"use client";

import { useRef, useState } from "react";

type Reference = {
  id: string;
  url: string;
  name: string;
};

export default function Home() {
  const [mode, setMode] = useState("auto");
  const [images, setImages] = useState<Reference[]>([]);
  const [prompt, setPrompt] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const selected = Array.from(files).filter((file) => {
      return (
        file.type.startsWith("image/") ||
        /\.(png|jpe?g|webp|gif|heic|heif)$/i.test(file.name)
      );
    });

    setImages((prev) => {
      const available = 5 - prev.length;

      const newImages = selected.slice(0, available).map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      return [...prev, ...newImages];
    });

    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const image = prev.find((item) => item.id === id);
      if (image) URL.revokeObjectURL(image.url);
      return prev.filter((item) => item.id !== id);
    });
  }

  function moveImage(index: number, direction: number) {
    const next = [...images];
    const target = index + direction;

    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <nav className="flex justify-between border-b border-white/10 px-8 py-6">
        <h1 className="text-xl font-bold tracking-[0.25em]">INK AI.</h1>
        <span className="text-xs tracking-widest text-zinc-500">
          TATTOO GENERATOR
        </span>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="mb-4 text-xs tracking-[0.4em] text-zinc-500">
          YOUR IDEA. YOUR DESIGN.
        </p>

        <h2 className="text-5xl font-bold md:text-7xl">
          Создай свою
          <br />
          <span className="text-zinc-500">татуировку.</span>
        </h2>

        <p className="mt-6 text-zinc-400">
          Превращай свои идеи в уникальные тату-эскизы
          с помощью искусственного интеллекта.
        </p>

        <div className="mt-12 flex gap-3">
          <button
            onClick={() => setMode("auto")}
            className={`flex-1 rounded-xl border p-4 ${
              mode === "auto"
                ? "border-white bg-white text-black"
                : "border-white/15"
            }`}
          >
            AUTO MODE
            <span className="mt-2 block text-xs opacity-60">
              ИИ решает сам
            </span>
          </button>

          <button
            onClick={() => setMode("custom")}
            className={`flex-1 rounded-xl border p-4 ${
              mode === "custom"
                ? "border-white bg-white text-black"
                : "border-white/15"
            }`}
          >
            CUSTOM MODE
            <span className="mt-2 block text-xs opacity-60">
              Твои инструкции
            </span>
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-white/20 p-8 text-center">
          <div className="mb-4 text-4xl">＋</div>
          <h3>Загрузи свои референсы</h3>
          <p className="mt-2 text-sm text-zinc-500">
            До 5 изображений · PNG, JPG, WEBP
          </p>

          <input
            ref={fileInput}
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            className="hidden"
            onChange={(event) => uploadFiles(event.target.files)}
          />

          <button
            disabled={images.length >= 5}
            onClick={() => fileInput.current?.click()}
            className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black disabled:opacity-40"
          >
            Выбрать фотографии
          </button>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((image, index) => (
              <div key={image.id} className="text-left">
                <img
                  src={image.url}
                  alt={image.name}
                  className="aspect-square w-full rounded-xl object-cover"
                />

                <p className="mt-2 truncate text-xs text-zinc-400">
                  {image.name}
                </p>

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg border border-white/20 px-3 py-2 disabled:opacity-20"
                  >
                    ←
                  </button>

                  <button
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    className="rounded-lg border border-white/20 px-3 py-2 disabled:opacity-20"
                  >
                    →
                  </button>

                  <button
                    onClick={() => removeImage(image.id)}
                    className="ml-auto rounded-lg border border-red-500/40 px-3 py-2 text-red-400"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-zinc-500">
            Загружено: {images.length} / 5
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-3 block text-sm text-zinc-400">
            Опиши свою идею
          </label>

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={
              mode === "auto"
                ? "Опиши желаемый результат..."
                : "Укажи, какие элементы взять из каждого фото..."
            }
            className="min-h-32 w-full rounded-xl border border-white/15 bg-[#111] p-5 text-sm outline-none focus:border-white/50"
          />
        </div>

        <button
          disabled
          className="mt-6 w-full rounded-xl bg-white/20 py-5 font-semibold text-white/50"
        >
          AI GENERATION — СКОРО
        </button>
      </section>
    </main>
  );
}
