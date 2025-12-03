import webbrowser
import warnings
import numpy as np
import sql_helper 
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from d3blocks import D3Blocks
from playwright.sync_api import sync_playwright
from pathlib import Path
from PIL import Image
import glob, shutil, re, os
import plotly.graph_objects as go
webbrowser.open = lambda *args, **kwargs: None  # prevent auto browser popups
warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)
import os
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go



# --- NEW: make sure export folders exist ---
HTML_DIR = Path(__file__).resolve().parent.parent / "html"
FIG_DIR  = Path(__file__).resolve().parent.parent / "fig"

def get_flag_table(show=False):
    conn=sql_helper.connect_server()
    query=''' SELECT * FROM work_rizvanov_a263.stroke_cohort_flag_polypharmacy'''
    flag_table=sql_helper.query_to_table(query, conn)
    conn.close()
    if show: print(flag_table.head())
    return flag_table


def get_initial_look(flag_table):
    # ensure output folder exists
    os.makedirs('./fig', exist_ok=True)

    cols = ['has_polypharmacy','has_anxiety','has_bipolar','has_psychosis','has_ptsd','has_schizo','has_seizure','has_depression','has_aphasia']
    individual_counts = flag_table[cols].sum().reset_index()
    individual_counts.columns = ['Condition', 'Count']


    # make names nicer
    individual_counts['Condition'] = (individual_counts['Condition'].str.replace('has_', '').str.replace('_', ' ').str.title())
    # Bar chart

    plt.bar(x=individual_counts['Condition'], height=individual_counts['Count'])
    plt.xticks(rotation=45)
    plt.title("Count of Patients by Condition Flag")
    plt.savefig("./fig/flag_eda_first_look/flag_counts_bar.png", bbox_inches="tight", dpi=300)
    plt.close()
    #Table
    # assuming `individual_counts` is already your DataFrame
    fig = go.Figure(data=[
        go.Table(header=dict(values=list(individual_counts.columns), align='center',
                fill_color='lightgrey', font=dict(size=14, family='Arial')),

                cells=dict(values=[individual_counts[col] for col in individual_counts.columns],
                align='center',fill_color=[["white", "lightgrey"] * 10], font=dict(size=12)))])
    fig.write_image("./fig/flag_eda_first_look/flag_counts_table.png", scale=4)

def make_co_occurence_heatmap(flag_table):

    cols = ['has_polypharmacy','has_anxiety','has_bipolar','has_psychosis','has_ptsd','has_schizo','has_seizure','has_depression','has_aphasia']


    df = flag_table[cols]

    # Compute pairwise co-occurrence counts
    pairwise_counts = pd.DataFrame(index=cols, columns=cols)
    for c1 in cols:
        for c2 in cols:
            pairwise_counts.loc[c1, c2] = ((df[c1] == 1) & (df[c2] == 1)).sum()
    pairwise_counts = pairwise_counts.astype(int)

    # Mask upper triangle (hide)
    mask = np.triu(np.ones_like(pairwise_counts, dtype=bool), k=0)

    plt.figure(figsize=(10, 8))
    ax = sns.heatmap(
        pairwise_counts,
        annot=True, fmt="d",
        cmap="Blues",
        mask=mask,
        cbar=True,
        linewidths=0  # no default heatmap gridlines
    )


    n = len(cols)
    for i in range(n):
        for j in range(n):
            if j <= i:  # lower triangle + diagonal only
                box_size = 0.80  # ~80% of cell
                offset = (1 - box_size) / 2
                rect = FancyBboxPatch(
                    (j + offset, i + offset), box_size, box_size,
                    boxstyle="round,pad=0.05,rounding_size=0.1",
                    linewidth=1.5, edgecolor='gray', facecolor='none'
                )
                ax.add_patch(rect)
    # Manually add diagonal text only (no color)
    for i in range(len(cols)):
        ax.text(
            i + 0.5, i + 0.5,
            pairwise_counts.iloc[i, i],
            ha='center', va='center',
            color='black', fontsize=11, fontweight='bold'
        )

    plt.title("Pairwise Co-Occurrence For Conditions (including polypharmacy)")
    plt.ylabel("Condition A")
    plt.xlabel("Condition B")
    plt.tight_layout()
    plt.savefig("./fig/flag_eda_first_look/lower_trianfle_co_occurence_heatmap.png")
    plt.close('all')



def edit_html(html_path, graph_title):
    p = Path(html_path)
    html = p.read_text(encoding="utf-8")
    html = re.sub(r"<div id=['\"]export_container['\"][^>]*>.*?</div>", "", html, flags=re.DOTALL)

    new_block = (
        f"<div id='export_container' "
        f"style='display:flex;flex-direction:column;align-items:center;width:100%;'>"
        f"<h2 style='text-align:center;font-family:sans-serif;margin:0 0 0 0'>{graph_title}</h2>"
        f"</div>"
    )

    html = re.sub(r"<body[^>]*>", r"\g<0>\n" + new_block, html, count=1, flags=re.IGNORECASE)

    html = html.replace(
        "document.body.append(svg);",
        """(() => {
            const wrap = document.getElementById('export_container');
            if (wrap) wrap.appendChild(svg);
            else document.body.append(svg);
        })();"""
    )

    p.write_text(html, encoding="utf-8")


def screenshot_export_container(html_path: str, out_png: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(f"file:///{Path(html_path).resolve()}")
        page.wait_for_load_state("networkidle")
        container = page.locator("#export_container")
        container.screenshot(path=out_png)
        browser.close()


def make_chord_graph_png(flag_table, graph_title):
    flag_cols =  ['has_polypharmacy','has_anxiety','has_bipolar','has_psychosis','has_ptsd','has_schizo','has_seizure','has_depression','has_aphasia']

    # --- Build edges --------------------------------------------------------
    edges = []
    for i, a in enumerate(flag_cols):
        for j, b in enumerate(flag_cols):
            if i < j:
                pair_count = ((flag_table[a] == 1) & (flag_table[b] == 1)).sum()
                normalized_weight = (pair_count / len(flag_table)) * 100  # percent
                if normalized_weight > 0:
                    edges.append([
                        a.replace("has_", "").upper(),
                        b.replace("has_", "").upper(),
                        round(normalized_weight, 2)
                    ])
    df = pd.DataFrame(edges, columns=["source", "target", "weight"])
    df["weight"] = df["weight"].astype(float)
    # --- Initialize D3Blocks ------------------------------------------------
    
    d3 = D3Blocks(chart="Chord", frame=False)
 
    # # --- Render chord -------------------------------------------------------
    d3.chord(df,color=None, cmap='viridis_r', fontsize=20)
    d3.show(filepath=f"{HTML_DIR}/chord_{graph_title}.html'")

    # --- HTML export --------------------------------------------------------
    html_path = HTML_DIR / f"chord_{graph_title}.html"
    tmp = max(glob.glob(str(Path.home() / "AppData/Local/Temp/1/d3blocks/*.html")),
              key=os.path.getmtime)
    shutil.copy(tmp, html_path)
    edit_html(html_path, graph_title)

    # --- PNG export ---------------------------------------------------------
    png_path = FIG_DIR /'flag_eda_first_look'/ f"{graph_title}.png"
    screenshot_export_container(html_path, str(png_path))



def stitch_horizontal(left_png: str, right_png: str, out_png: str):
    left = Image.open(left_png).convert("RGBA")
    right = Image.open(right_png).convert("RGBA")
    height = max(left.height, right.height)
    gap = 150
    width = left.width + right.width - gap
    combined = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    combined.paste(left, (0, (height - left.height)//2))
    combined.paste(right, (left.width-gap, (height - right.height)//2))
    combined.convert("RGB").save(out_png, "PNG")


if __name__ == "__main__":

    flag_table = get_flag_table(show=True)
    get_initial_look(flag_table)
    
    flag_aph  = flag_table[flag_table["has_aphasia"] == 1]
    flag_non  = flag_table[flag_table["has_aphasia"] == 0]

    make_chord_graph_png(flag_aph,  "Aphashia")
    make_chord_graph_png(flag_non,  "Non_Aphashia")
    make_chord_graph_png(flag_table,  "all_conditions")

    left  = FIG_DIR /'flag_eda_first_look'/ "Aphashia.png"
    right = FIG_DIR /'flag_eda_first_look'/ "Non_Aphashia.png"
    stitch_horizontal(str(left), str(right), FIG_DIR / 'flag_eda_first_look' /"aphasia_v_nonahashia_chord_graph.png")
    make_co_occurence_heatmap(flag_table)