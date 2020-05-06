# This is the title

Here's the table of contents:

1. TOC
{:toc}
Some machine learning approaches make the most of the extra context provided by graph databases, specifically in terms of which relationships are meaningful. 

ML to be applied is different each level. 
Broadly speaking:

1. PROJECT & PROGRAMME level: node, edge and property prediction for risks, dependencies, project sectoral properties and success.

2. PORTFOLIO level: mostly standard network algorithms (centrality, breadth first search etc). Includes the conversion between graph and tree structures to provide appropriate views for different stakeholders. The ML element is currently restricted to identifying common and anomalous graph motifs.

3. TASK AND SCHEDULE level: This is the least well developed, but a broad range of approaches to making the most of the Optimisation work of Professor Warren B. Powell, making the most of the inherent graph structure of resource-task-outcome paths. 
Eventually exploring Graph-Graph neural networks & Seq-Seq/ Transformer approaches as well as Monte Carlo Tree search

4. PMO and CENTRE OF EXCELLENCE. NLP applied to boost taxonomic and semantic approaches to curating body of project practice for the orgranisation. 


## Basic setup

Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-filename.md`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `filename` is whatever file name you choose, to remind yourself what this post is about. `.md` is the file extension for markdown files.

The first line of the file should start with a single hash character, then a space, then your title. This is how you create a "*level 1 heading*" in markdown. Then you can create level 2, 3, etc headings as you wish but repeating the hash character, such as you see in the line `## File names` above.

## Basic formatting

You can use *italics*, **bold**, `code font text`, and create [links](https://www.markdownguide.org/cheat-sheet/). Here's a footnote [^1]. Here's a horizontal rule:

---

## Lists

Here's a list:

- item 1
- item 2

And a numbered list:

1. item 1
1. item 2

## Boxes and stuff

> This is a quotation

{% include alert.html text="You can include alert boxes" %}

...and...

{% include info.html text="You can include info boxes" %}

## Images

![](/images/logo.png "fast.ai's logo")

## Code

General preformatted text:

    # Do a thing
    do_thing()

Python code and output:

```python
# Prints '2'
print(1+1)
```

    2

## Tables

| Column 1 | Column 2 |
|-|-|
| A thing | Another thing |

## Footnotes

[^1]: This is the footnote.

