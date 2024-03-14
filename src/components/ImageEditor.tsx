import type Konva from "konva";
import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image, Layer, Stage, Transformer } from "react-konva";

const ImageEditor: React.FC = () => {
  const [firstImage, setFirstImage] = useState<HTMLImageElement | null>(null);
  const [secondImage, setSecondImage] = useState<HTMLImageElement | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  const onDropFirstImage = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        setFirstImage(img);
      };
    };
    reader.readAsDataURL(file!);
  };

  const onDropSecondImage = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        setSecondImage(img);
      };
    };
    reader.readAsDataURL(file!);
  };

  const { getRootProps: getFirstRootProps, getInputProps: getFirstInputProps } =
    useDropzone({
      onDrop: onDropFirstImage,
      accept: {
        "image/jpeg": [],
        "image/png": [],
      },
      maxFiles: 1,
    });

  const {
    getRootProps: getSecondRootProps,
    getInputProps: getSecondInputProps,
  } = useDropzone({
    onDrop: onDropSecondImage,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });

  const handleTransform = () => {
    const node = transformerRef.current;
    if (node) {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(scaleX > 0 ? scaleX : 0.1);
      node.scaleY(scaleY > 0 ? scaleY : 0.1);

      node.getLayer()?.batchDraw();
    }
  };

  const handleDownload = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ mimeType: "image/png" });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "download.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const showTransformer = (e: Konva.KonvaEventObject<MouseEvent>) => {
    transformerRef.current?.show();
    transformerRef.current?.nodes([e.target]);
  };

  const resetImage = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.target.size({ width: 450, height: 450 });
    e.target.position({ x: 0, y: 0 });
    e.target.scale({ x: 1, y: 1 });
    e.target.rotation(0);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-10 py-10">
      <div className="w-full max-w-lg cursor-pointer rounded-lg border border-dashed border-gray-400 p-4">
        <div {...getFirstRootProps()}>
          <input {...getFirstInputProps()} />
          <p className="text-center">
            Drag & drop the first image here, or click to select one
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg cursor-pointer rounded-lg border border-dashed border-gray-400 p-4">
        <div {...getSecondRootProps()}>
          <input {...getSecondInputProps()} />
          <p className="text-center">
            Drag & drop the second image here, or click to select one
          </p>
        </div>
      </div>

      <div className="space-y-2 w-[450px] h-[450px]">
        <Stage
          width={450}
          height={450}
          className="rounded-lg border border-gray-400 p-4"
          ref={stageRef}
          onMouseLeave={() => transformerRef.current?.hide()}
        >
          <Layer>
            {firstImage && (
              <Image
                image={firstImage}
                width={450}
                height={450}
                draggable
                onClick={showTransformer}
                onTap={showTransformer}
                onDblClick={resetImage}
                onDblTap={resetImage}
                alt="uploaded image"
              />
            )}
            {secondImage && (
              <Image
                image={secondImage}
                width={400}
                height={400}
                x={25}
                y={25}
                draggable
                onClick={showTransformer}
                onTap={showTransformer}
                onDblClick={resetImage}
                onDblTap={resetImage}
                alt="second uploaded image"
              />
            )}
            <Transformer ref={transformerRef} onTransform={handleTransform} />
          </Layer>
        </Stage>
        <p className="text-center text-xs text-zinc-500">
          * Double click the image to center/reset *
          <br />
          Made with ❤️ by{" "}
          <a
            href="https://discord.com/users/284489990598295552"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Kairos
          </a>
        </p>
      </div>

      <button
        className="rounded-lg bg-zinc-950 px-4 py-2 text-white hover:bg-zinc-900"
        onClick={handleDownload}
      >
        Download Image
      </button>
    </div>
  );
};

export default ImageEditor;
