import React from 'react';
import transformationDiagram from './project-controls-transformation.svg?url';

const sources = {
  office: 'https://news.microsoft.com/source/2010/05/12/microsoft-delivers-the-future-of-productivity-with-office-2010-and-sharepoint-2010/',
  cloud: 'https://aws.amazon.com/blogs/aws/amazon_s3/',
  nplan: 'https://www.nplan.io/press-releases/bam-joins-forces-with-nplan-to-roll-out-new-approach-to-portfolio-risk-management-powered-by-ai-and-past-project-data',
  twins: 'https://azure.microsoft.com/en-us/blog/azure-digital-twins-now-generally-available-create-iot-solutions-that-model-the-real-world/',
  wardley: 'https://medium.com/wardleymaps/finding-a-new-purpose-8c60c9484d3b'
};

const earlier = [
  ['Project Management Software', 'Product example: Microsoft Project. The original also named Primavera. A product can still require bespoke configuration.'],
  ['Document Management', 'Product example: SharePoint. Its availability does not establish that project records were connected or well governed.'],
  ['Schedule Management', 'A function, not one component with one maturity. Specify the scheduling tool and the planning practice separately.'],
  ['Cost Management', 'A function. Its processes, models and software may occupy different stages.'],
  ['Risk Registers', 'Originally “spreadsheet-based”. Separate the purchased spreadsheet software from the local register and risk practice.'],
  ['Manual Progress Reporting', 'A working practice. Manual work is not, by itself, evidence of an early evolution stage.'],
  ['Siloed Data Storage', 'An arrangement of data and systems. “Siloed” does not tell us the maturity of its storage technology.'],
  ['Basic Analytics', 'Too broad to place. Name the analysis, software and local data preparation first.'],
  ['Basic Cloud Infrastructure', 'Utility example: metered cloud storage. Utility provision was available before the 2010s.'],
  ['Manual Integration', 'A local activity. Its interfaces, scripts and effort need their own assessment.']
];
const later = [
  ['AI-Powered Platforms', 'Product example: nPlan. The 2023 product announcement supports commercial availability, not autonomous control of an entire project.'],
  ['Digital Project Twins', 'Product/service building blocks existed by 2020, for example Azure Digital Twins. A project-specific model and its integration remain separate components.'],
  ['Automated Risk Management', 'The original phrase overstates scope. Forecasting and risk analysis can be product capabilities; decisions and accountability still need to be specified.'],
  ['Real-time Monitoring', 'Originally “IoT, Drones”. Sensors, capture services and project integration need separate positions; the bundle has no single established stage here.'],
  ['Unified Data Platform', '“Unified” describes an intended integration outcome. It does not prove that a platform is novel, integrated in practice, or a utility.'],
  ['Cloud Services', 'Utility example: metered storage. The date contrast does not mean that every cloud service became a commodity in 2025.']
];

export default function ProjectControlsTransformation() {
  return <section className="controls-transformation" id="controls-transformation" aria-labelledby="transformation-title">
    <p className="controls-kicker">A second lens · retained historical interpretation</p>
    <h2 id="transformation-title">Project controls: a 2010s–2025 transformation picture</h2>
    <p>The earlier drawing contrasted separate planning and controls tools with a 2025 emphasis on prediction, monitoring and connected data. That is a useful question for a controls lead: <strong>what needs to connect to produce a credible delivery forecast?</strong> It is an authored interpretation of changing emphasis, not a measured industry transformation or a claim that older practices disappeared.</p>
    <div className="controls-reading-guide">
      <div><h3>Read up and down</h3><p>Visibility is relative to a user and their need. A Wardley value chain links a capability to the components it depends on. This picture groups tools above supporting infrastructure; it does not establish a real project's dependency chain or rank business value.</p></div>
      <div><h3>Read left and right</h3><p>Evolution runs from genesis through custom-built and product/rental to commodity/utility. It is not a time axis. A newer product can sit to the right, while local integration around it may still be custom. Broad stage choices here are interpretive.</p></div>
    </div>
    <figure>
      <div className="controls-diagram-scroll" tabIndex={0} role="region" aria-label="Corrected project controls diagram; scroll horizontally on a small screen">
        <img src={transformationDiagram} width="1200" height="910" alt="2010s blue circles and 2025 orange squares compare selected components. Project and document software, nPlan, and digital-twin platform building blocks are shown in the product/service area; metered cloud storage is in the utility area for both periods. Ten broad functions or local arrangements are left unplaced. Heights are a discussion layout, not verified dependencies. Full component notes follow." />
      </div>
      <figcaption>On a small screen, scroll the picture horizontally; the complete text view follows. Corrected from the original “Project Controls 2010–2025 Transformation” SVG. Shapes distinguish the two dated views. Positions indicate example supply forms, not measured coordinates or universal maturity. <a href={transformationDiagram}>Open the readable SVG</a>.</figcaption>
    </figure>
    <div className="controls-comparison">
      <div><h3>2010s emphasis: assembling the controls picture</h3><p>The original ten components, with their interpretation made explicit.</p><dl>{earlier.map(([name, note]) => <React.Fragment key={name}><dt>{name}</dt><dd>{note}</dd></React.Fragment>)}</dl></div>
      <div><h3>2025 emphasis: prediction and connection</h3><p>The original six components. These are additions to discuss, not a replacement list.</p><dl>{later.map(([name, note]) => <React.Fragment key={name}><dt>{name}</dt><dd>{note}</dd></React.Fragment>)}</dl></div>
    </div>
    <details className="controls-corrections"><summary>What changed in the original picture, and why?</summary>
      <ul>
        <li>The leftward “Transformation” arrow is removed. Change over time cannot be read as movement towards genesis, or assumed to follow one direction for a whole service.</li>
        <li>The named AI offering is shown as a product example. Digital-twin platform building blocks are distinguished from a project's own model. Newness does not establish genesis.</li>
        <li>Metered cloud storage is shown as a utility example in both periods. The old chart's “basic cloud” position understated the availability of utility provision before the 2010s.</li>
        <li>Ten broad labels are retained without assigning a stage. A register, reporting practice or data arrangement cannot inherit the evolution position of its software.</li>
        <li>The two continuous chains have been removed: the source supplied no evidence that every adjacent component depended on the next. To make a full map, choose a real user need, name the components and verify each dependency.</li>
      </ul>
    </details>
    <h3>Historical anchors and limits</h3>
    <p>These primary sources support the availability of particular offerings. They do not measure adoption, integration, benefits or the diagram's positions.</p>
    <ul className="controls-sources">
      <li><a href={sources.office}>Microsoft, 12 May 2010</a>: business availability of Project 2010 and SharePoint 2010 supports the earlier product examples.</li>
      <li><a href={sources.cloud}>AWS, 14 March 2006</a>: the S3 launch describes pay-as-you-go storage provision; cloud storage was not a new utility in 2025.</li>
      <li><a href={sources.nplan}>nPlan, 27 July 2023</a>: the Portfolio launch is a dated example of an AI-based risk product. The supplier's outcome claims are not independently validated here.</li>
      <li><a href={sources.twins}>Microsoft Azure, 8 December 2020</a>: general availability of digital-twin platform building blocks; this does not establish the maturity of every project twin.</li>
      <li><a href={sources.wardley}>Simon Wardley, “Finding a new purpose”</a>: evolution concerns changing characteristics and cannot be measured simply by elapsed time.</li>
    </ul>
    <p className="controls-takeaway"><strong>Use the contrast:</strong> choose one forecast your team needs. Trace the information and human decisions it depends on, then distinguish what you can buy from what you must configure, connect or learn. The dated picture is a prompt for that investigation.</p>
    <a href="#software-timeline">Return to the software timeline ↑</a>
  </section>;
}
