Email services and upload forms often reject attachments over a certain size, and a single scanned document can easily be 20 MB or more. Compressing a PDF can solve that — but only if you understand what is making the file big. This guide explains where PDF size comes from, which compression methods help, and when compression simply will not make a difference.

## What makes a PDF large?

A PDF is a container. Its size depends on what is inside:

- **Images** — by far the most common cause. Scanned pages are full-page images, and photos from modern phones can be several megabytes each.
- **Embedded fonts** — PDFs often include the fonts they use so they look the same everywhere. Some large fonts add hundreds of kilobytes.
- **Unused or duplicate data** — files edited many times can keep old versions of objects. Some programs also save inefficiently.
- **Metadata and extras** — thumbnails, attachments, form data and editing history.

Text itself is tiny. A 100-page text-only report may be well under 1 MB.

## Method 1: Structural clean-up (lossless)

The safest approach rewrites the file more efficiently without touching the content:

- Grouping many small internal objects into compressed "object streams".
- Removing objects that are no longer used anywhere.
- Dropping leftovers from incremental saves.

Text stays selectable, links keep working and image quality does not change. The trade-off is that savings are unpredictable: a file exported by an efficient program may shrink by only a few percent, while a file assembled by older software or edited repeatedly can shrink substantially. This is the "Basic" option in our [PDF Compressor](/pdf-tools/pdf-compressor/).

## Method 2: Reducing image quality (lossy)

For scans and photo-heavy PDFs, the big savings come from images. There are two ways to reduce them:

- **Downsampling** — lowering the resolution. Scans are often saved at 300 DPI (dots per inch) or more; for on-screen reading, 120–150 DPI is usually enough.
- **Stronger JPEG compression** — storing each image at a lower quality setting.

Our "Strong" option goes one step further: it renders each whole page as an image at the resolution you choose and rebuilds the PDF from those images. For scanned documents this is very effective — a 24 MB scan can often drop to a few megabytes. **But it has real costs:**

- Text is no longer selectable or searchable (it becomes part of the picture).
- Screen readers cannot read the content, which matters for accessibility.
- Links, bookmarks and form fields are lost.
- Text-only PDFs may get *larger*, because a picture of text takes more space than the text.

Use it for scans and image-heavy files, and keep your original.

## When compression won't help

Be wary of any tool that promises to shrink every PDF by a fixed amount. Compression often achieves little when:

- The PDF is mostly text with standard fonts.
- Images are already compressed efficiently.
- The file was already optimised by a previous tool.

A trustworthy compressor shows the real before-and-after size and tells you when your original is already the better file. Ours does exactly that.

## Other ways to make a PDF smaller

If compression is not enough, consider these options:

1. **Remove pages you do not need.** Use the [PDF Splitter](/pdf-tools/pdf-splitter/) to keep only the relevant pages — often the easiest saving of all.
2. **Re-scan at a lower resolution.** For text documents, 150–200 DPI in greyscale is usually readable and much smaller than 300 DPI colour.
3. **Export again from the original document.** Word processors and design apps often have a "smaller file size" or "minimum size" export option.
4. **Split into several files.** If an email limit is the problem, sending two attachments may be simpler.

## A practical workflow for email attachments

1. Check the size limit (many email services allow attachments in the 20–25 MB range, but corporate systems are often stricter).
2. Try the lossless Basic compression first.
3. If the file is still too large and it is a scan, use Strong compression at "Balanced" quality.
4. Open the result and check that every page is readable before sending.
5. Keep the original in case you need searchable text later.

## Is it safe to compress PDFs online?

Many online compressors upload your file to their servers. For contracts, bank statements, medical letters or ID documents, that is a real privacy concern. ToolKitWorld's PDF tools run inside your browser instead: your file is processed by your own device and never uploaded. You can verify this by loading the page, disconnecting from the internet, and compressing a file anyway.

## Frequently asked questions

### Does compressing a PDF reduce quality?

Lossless structural compression does not. Image-based compression does, by design — you choose how much.

### Why did my PDF get bigger after compressing?

Usually because it was mostly text and you used image-based compression, or the file was already optimised. Keep the original in that case.

### Can I compress a password-protected PDF?

Not until the protection is removed. You need the password to unlock it in a PDF reader first.

### What is a good size for a PDF to email?

Under 10 MB is widely accepted; under 5 MB is safer for strict corporate mail servers.

## Conclusion

PDF size mostly comes from images. Start with a lossless clean-up, use image compression only for scans and photo-heavy files, and always compare the result with your original. Cutting unnecessary pages is often the easiest saving of all.
