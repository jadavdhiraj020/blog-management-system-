import { useState, useCallback, useMemo } from "react";
import { Post, PostCategory } from "@/types/blog";

const VALID_CATEGORIES: PostCategory[] = [
  "technology",
  "design",
  "business",
  "lifestyle",
  "tutorial",
  "opinion",
  "news",
];

interface PostFormValues {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  coverImageUrl: string;
  status: string;
}

interface PostFormErrors {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
}

interface UsePostFormReturn {
  values: PostFormValues;
  handleChange: (field: keyof PostFormValues, value: string) => void;
  errors: PostFormErrors;
  handleSubmit: () => PostFormValues | null;
  reset: () => void;
  isDirty: boolean;
  wordCount: number;
  readingTimeMinutes: number;
}

export function usePostForm(initialValues?: Partial<Post>): UsePostFormReturn {
  const defaultValues: PostFormValues = useMemo(() => ({
    title: initialValues?.title || "",
    excerpt: initialValues?.excerpt || "",
    content: initialValues?.content || "",
    category: initialValues?.category || "",
    tags: initialValues?.tags?.join(", ") || "",
    coverImageUrl: initialValues?.coverImageUrl || "",
    status: initialValues?.status || "draft",
  }), [initialValues]);

  const [values, setValues] = useState<PostFormValues>(defaultValues);
  const [errors, setErrors] = useState<PostFormErrors>({});

  const handleChange = useCallback((field: keyof PostFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const wordCount = useMemo(() => {
    return values.content.trim().split(/\s+/).filter(Boolean).length;
  }, [values.content]);

  const readingTimeMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const isDirty = useMemo(() => {
    return (
      values.title !== defaultValues.title ||
      values.excerpt !== defaultValues.excerpt ||
      values.content !== defaultValues.content ||
      values.category !== defaultValues.category ||
      values.tags !== defaultValues.tags ||
      values.coverImageUrl !== defaultValues.coverImageUrl ||
      values.status !== defaultValues.status
    );
  }, [values, defaultValues]);

  const validate = useCallback((): PostFormErrors => {
    const errs: PostFormErrors = {};
    if (!values.title || values.title.length < 5) {
      errs.title = "Title must be at least 5 characters";
    }
    if (!values.excerpt) {
      errs.excerpt = "Excerpt is required";
    } else if (values.excerpt.length > 200) {
      errs.excerpt = "Excerpt must be at most 200 characters";
    }
    if (!values.content || values.content.length < 50) {
      errs.content = "Content must be at least 50 characters";
    }
    if (!values.category || !VALID_CATEGORIES.includes(values.category as PostCategory)) {
      errs.category = "Please select a valid category";
    }
    return errs;
  }, [values]);

  const handleSubmit = useCallback((): PostFormValues | null => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return null;
    return values;
  }, [validate, values]);

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
  }, [defaultValues]);

  return {
    values,
    handleChange,
    errors,
    handleSubmit,
    reset,
    isDirty,
    wordCount,
    readingTimeMinutes,
  };
}
