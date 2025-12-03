import sql_helper
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import xgboost as xgb
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import roc_auc_score, f1_score, classification_report,precision_recall_curve, average_precision_score
import shap
from pathlib import Path


FIG_DIR  = Path(__file__).resolve().parent.parent / "fig"/"xgb"
FIG_DIR.mkdir(parents=True, exist_ok=True)

def load_final_table(final_table, save_csv=False):
    base_path = Path.cwd().parent / "data"
    base_path.mkdir(exist_ok=True)
    file_path = base_path / "hospital_readmission.csv"
    if file_path.is_file():
        
        df = pd.read_csv(file_path)
        df=df[df["has_dementia"] == 0]
        return df
    else:
        conn = sql_helper.connect_server()
        df = sql_helper.query_to_table(f"SELECT * FROM {final_table};", conn)
        df.to_csv(file_path, index=False)
        conn.close()
        df=df[df["has_dementia"] == 0]
        return df 


def run_xgboost(readmission):
    feature_cols = [
    'has_aphasia','has_anxiety','has_bipolar','has_depression','has_psychosis','has_ptsd',
    'has_schizo','has_seizure','took_antidep','took_anxiolytic','took_hyp_sed','took_antipsych',
    'antidepressant_pim','anxiolytic_pim','sedative_pim','antipsychotic_pim','any_pim',
    'has_polypharmacy','polypharmacy_count']

    # --- Final input matrix ---
    X = readmission[feature_cols].fillna(0)
    y = (readmission["readmission_180d"] > 0).astype(int)

        # --- Train/test split ---
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # --- Base model ---
    base = XGBClassifier(
        eval_metric="auc",
        use_label_encoder=False,
        scale_pos_weight=y_train.value_counts()[0] / y_train.value_counts()[1])

    # --- Hyperparameter search space ---
    param_dist = {
        "n_estimators": [200, 300, 500, 800],
        "learning_rate": [0.01, 0.03, 0.05, 0.1],
        "max_depth": [2, 3, 4, 5, 6],
        "subsample": [0.6, 0.7, 0.8, 1.0],
        "colsample_bytree": [0.6, 0.7, 0.8, 1.0],
        "min_child_weight": [1, 3, 5, 10],
        "gamma": [0, 0.1, 0.2, 0.3],
        "reg_lambda": [1.0, 1.5, 2.0, 3.0],
        "reg_alpha": [0, 0.1, 0.5, 1.0]
    }
    # --- Randomized Search ---
    search = RandomizedSearchCV(
        estimator=base,
        param_distributions=param_dist,
        n_iter=30,                 
        scoring="f1",
        cv=3,
        verbose=1,
        n_jobs=-1,
        random_state=42
    )

    search.fit(X_train, y_train)
    print("Best params:", search.best_params_)
    best_model=search.best_estimator_
    pred_prob = best_model.predict_proba(X_test)[:, 1]
    pred_label = best_model.predict(X_test)

    print("ROC-AUC:", roc_auc_score(y_test, pred_prob))
    print("F1:", f1_score(y_test, pred_label))
    print(classification_report(y_test, pred_label))


    return best_model,X_test,X_train, y_train,y_test, pred_prob ,pred_label

def plot_xgb(best_model):
    plt.figure(figsize=(10, 6))
    xgb.plot_importance(best_model, max_num_features=20, height=0.5)
    plt.title("XGBoost Feature Importance for 180d Readmission")
    plt.savefig(FIG_DIR / "xgb_feature_importance_180d.png", dpi=300, bbox_inches="tight")

def plot_precision_recall(y_test, pred_prob):
    precision, recall, thresholds = precision_recall_curve(y_test, pred_prob)
    ap = average_precision_score(y_test, pred_prob)
    plt.figure(figsize=(8, 6))
    plt.plot(recall, precision, linewidth=2)
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title(f"Precision–Recall Curve (AP = {ap:.3f})")
    plt.grid(True)
    plt.savefig(FIG_DIR / "precision_recall_curve_180d.png", dpi=300, bbox_inches="tight")
    plt.show()

def plot_shap(best_model,X_test):
    explainer = shap.TreeExplainer(best_model)
    shap_values = explainer.shap_values(X_test)
    # --- SHAP SUMMARY BAR PLOT ---
    plt.figure(figsize=(10, 8))
    shap.summary_plot(shap_values, X_test, plot_type="bar", show=False)
    plt.savefig(FIG_DIR /"shap_summary_bar.png", dpi=300, bbox_inches="tight")
    plt.close()

    # --- SHAP SUMMARY PLOT ---
    plt.figure(figsize=(8, 6))
    shap.summary_plot(shap_values, X_test, show=False)
    plt.savefig(FIG_DIR /"shap_summary_plot.png", dpi=300, bbox_inches="tight")
    plt.close()

    # --- False Positive SHAP SUMMARY BAR PLOT ---
    false_pos = (y_test == 0) & (best_model.predict(X_test) == 1)
    shap_values_fp = shap_values[false_pos]
    plt.figure(figsize=(8, 6))
    shap.summary_plot(shap_values_fp, X_test[false_pos], show=False)
    plt.savefig(FIG_DIR /"false_positive_shap_summary_plot.png", dpi=300, bbox_inches="tight")
    plt.close()

if __name__ == "__main__":
    final_table = 'work_rizvanov_a263.stroke_cohort_with_readmission_counts'
    readmission= load_final_table(final_table)
    best_model,X_test,X_train, y_train,y_test, pred_prob ,pred_label=run_xgboost(readmission)
    plot_xgb(best_model)
    plot_precision_recall(y_test, pred_prob)
    plot_shap(best_model,X_test)
