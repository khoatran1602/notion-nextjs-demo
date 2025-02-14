// Import necessary modules and components
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { getAllPublished, getSingleBlogPostBySlug } from "../../lib/notion";
import styles from "../../styles/Home.module.css";

// CodeBlock component for syntax highlighting
const CodeBlock = ({ language, codestring }) => {
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus} PreTag="div">
      {codestring}
    </SyntaxHighlighter>
  );
};

// Post component
const Post = ({ post }) => {
  return (
    <section className={styles.container}>
      <h2>{post.metadata.title}</h2>
      <span>{post.metadata.date}</span>
      <p style={{ color: "gray" }}>{post.metadata.tags.join(", ")}</p>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <CodeBlock
                codestring={String(children).replace(/\n$/, "")}
                language={match[1]}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Style for images to be centered
          img: ({ node, ...props }) => (
            <picture>
              <img {...props} className={styles.markdownImage} alt="Pic" />
            </picture>
          ),
        }}
      >
        {post.markdown}
      </ReactMarkdown>
    </section>
  );
};

// getStaticProps function for static generation
export const getStaticProps = async ({ params }) => {
  const post = await getSingleBlogPostBySlug(params.slug);
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

// getStaticPaths function for dynamic routes
export const getStaticPaths = async () => {
  const posts = await getAllPublished();
  const paths = posts.map(({ slug }) => ({ params: { slug } }));
  return {
    paths,
    fallback: "blocking",
  };
};

export default Post;
