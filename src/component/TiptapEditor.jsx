import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Dropdown, Space, Tooltip, Select } from "antd";
import TextStyle from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  FontSizeOutlined,
  FontColorsOutlined,
} from "@ant-design/icons";

// Define the FontSize extension
const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
    };
  },
});

// Define the FontFamily extension
const FontFamily = Extension.create({
  name: "fontFamily",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) =>
              element.style.fontFamily?.replace(/['"]/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) {
                return {};
              }

              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontFamily }).run();
        },
    };
  },
});

const TiptapEditor = ({ value, onChange, style }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, FontFamily],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const headingItems = [
    {
      key: "p",
      label: "Normal Text",
      onClick: () => editor.chain().focus().setParagraph().run(),
    },
    {
      key: "h1",
      label: "Heading 1",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      key: "h2",
      label: "Heading 2",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: "h3",
      label: "Heading 3",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      key: "h4",
      label: "Heading 4",
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
  ];

  const fontSizes = [
    { value: "12px", label: "Small" },
    { value: "16px", label: "Normal" },
    { value: "20px", label: "Large" },
    { value: "24px", label: "Huge" },
  ];

  const fontFamilies = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Calibri, sans-serif", label: "Calibri" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Verdana, sans-serif", label: "Verdana" },
  ];

  // Updated handler for font size
  const handleFontSizeChange = (size) => {
    editor.chain().focus().setFontSize(size).run();
  };

  // Updated handler for font family
  const handleFontFamilyChange = (font) => {
    editor.chain().focus().setFontFamily(font).run();
  };

  return (
    <div className="tiptap-editor">
      <div
        className="toolbar"
        style={{
          marginBottom: 8,
          padding: 8,
          height: "100%",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        <Space>
          <Tooltip title="Bold">
            <Button
              type={editor.isActive("bold") ? "primary" : "default"}
              icon={<BoldOutlined />}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
          </Tooltip>

          <Tooltip title="Italic">
            <Button
              type={editor.isActive("italic") ? "primary" : "default"}
              icon={<ItalicOutlined />}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
          </Tooltip>

          <Dropdown menu={{ items: headingItems }} placement="bottomLeft">
            <Button>Headings</Button>
          </Dropdown>

          <Tooltip title="Bullet List">
            <Button
              type={editor.isActive("bulletList") ? "primary" : "default"}
              icon={<UnorderedListOutlined />}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
          </Tooltip>

          <Select
            placeholder="Font Size"
            style={{ width: 120 }}
            options={fontSizes}
            onChange={handleFontSizeChange}
            prefix={<FontSizeOutlined />}
          />

          <Select
            placeholder="Font Family"
            style={{ width: 140 }}
            options={fontFamilies}
            onChange={handleFontFamilyChange}
            prefix={<FontColorsOutlined />}
          />
        </Space>
      </div>

      <EditorContent
        editor={editor}
        className="editor-content"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
};

export default TiptapEditor;
