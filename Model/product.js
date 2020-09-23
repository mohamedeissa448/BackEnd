var mongoose = require("mongoose");
var Hcm_ProductHistorySchema = mongoose.Schema(
  {
    Product_CheckedBy_User_Code: Number,
    Product_CheckedDate: Date,
    Product_EditedBy_User_Code: Number,
    Product_EditingTime: Date,
    Product_Name: String,
    Product_Suffix: String,
    Product_Chemical_Name: String,
    Product_Manufacturer: String,
    Product_Manufacturer_Code: Number,
    Product_Exporter: String,
    Product_Abbreviation: String,
    Product_IsActive: Number,
    Product_Molecular_Formula: String,
    Product_Molecular_Weight: String,
    Product_CAS_Number: String,
    Product_EC_Number: String,
    Product_Appearance: String,
    Product_Active_Content: String,
    Product_pH: String,
    Product_Sp_gravity: String,
    Product_Chloride: String,
    Product_Iron: String,
    Product_Phosphorous_Acid: String,
    Product_O_phosphate: String,
    Product_Hazen_color: String,
    Product_Category_ID: [Number],
    Product_Origin_Country_Code: Number,
    Product_Packing_Code: Number,
    Product_Supplier_Codes: [Number],
    Product_Customer_Codes: [Number],
    Product_SellingAreaCodes: [Number],
    Product_SellingAreaNames: [String],
    Product_MSDS: String,
    Product_Classes_Code: Number,
    Product_Assay: [String],
    Product_Form_Code: Number,
    Product_Certification: [Number],
    Melting_Unit_Tempreture_Unit_ID: Number,
    Boiling_Unit_Tempreture_Unit_ID: Number,
    Product_Release_Code: Number,
    Product_StorageType_Code: [Number],
    Product_ProductCategory_Code: [Number],
    Product_Volatile_Matter: String,
    Product_Sulphates: String,
    Product_Water_Insoluble_Matter: String,
    Product_Organic_Compounds: String,
    Product_Arsenic: String,
    Product_Lead: String,
    Product_Mercury: String,
    Product_Cadmium: String,
    Product_Heavy_Metals: String,
    Product_Ferrous_Fe2o3: String,
    Product_Alumumium_Al2O3: String,
    Product_Titanicum_Tio2: String,
    Product_Free_Fatty_Acids: String,
    Product_Peroxide_Value: String,
    Product_Iodine_Value: String,
    Product_Acetone: String,
    Product_Methanol: String,
    Product_Hydroyl_Number: String,
    Product_Impurities_Related_Substance: String,
    Product_Aldehyles: String,
    Product_Esters: String,
    Product_Chlorenated_Compound: String,
    Product_Water_Content: String,
    Product_Loss_On_Drying: String,
    Product_Starch_Test: String,
    Product_Sulfur_Dioxides_Residual: String,
    Product_Antimony: String,
    Product_Chrome: String,
    Product_Selenium: String,
    Product_Nickel: String,
    Product_Residual_On_Solvent: String,
    Product_Copper: String,
    Product_Oxalic_Acid: String,
    Product_Fumaric_Acid: String,
    Product_Maliec_Acid: String,
    Product_Non_Volatyl_Reside: String,
    Product_Ash: String,
    Product_Protien: String,
    Product_Nitrates: String,
    Product_Aflatoxine: String,
    Product_Melamine: String,
    Product_Free_Halogens: String,
    Product_Description: String,
    Product_Solubility: String,
    Product_Absorbance: String,
    Product_InfraRed_Absorption: String,
    Product_Think_Layer_Chromatography: String,
    Product_Identifications_Relative_Density: String,
    Product_Viscosity: String,
    Product_Foriein_Matter: String,
    Product_Relative_Density_From: String,
    Product_Relative_Density_To: String,
    Product_Bulk_Density_From: String,
    Product_Bulk_Density_to: String,
    Product_Relative_Index: String,
    Product_Spescific_Opticical_Rotation: String,
    Product_Specific_Surface_Area: String,
    Product_Residue_On_Sieve: String,
    Product_Boiling_Point: String,
    Product_Melting_Point: String,
    Product_Partical_Size: String,
    Product_Weight_Unit_Code: Number,
    Product_Weight_Value: Number,
    Product_Concentration_Unit_Code: Number,
    Product_Concentration_Value: String,
    Product_Remarkes: String,
    Product_Total_Plate_Count: String,
    Product_EColi: String,
    Product_Yeast: String,
    Product_Mould: String,
    Product_Pathogenic_Bacterium: String,
    Product_Escherichia_Cali: String,
    Product_Salmonila: String,
    Product_Staphyloccuse_Aureus: String,
    Product_Extra1: String,
    Product_Extra2: String,
    Product_Extra3: String,
    Product_Extra4: String,
    Product_Extra5: String,
    Product_Extra6: String,
    Product_Extra7: String,
    Product_Extra8: String,
    Product_Extra9: String,
    Product_Extra10: String,
    Product_Extra11: String
  },
  {
    toJSON: { virtuals: true }
  }
);

Hcm_ProductHistorySchema.virtual("HistoryCategory", {
  ref: "hcm_categories",
  localField: "Product_Category_ID",
  foreignField: "Category_ID",
  justOne: false // for many-to-1 relationships
});
Hcm_ProductHistorySchema.virtual("HistorySellingArea", {
  ref: "hcm_lut_sell_area",
  localField: "Product_SellingAreaCodes",
  foreignField: "SellingArea_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_ProductHistorySchema.virtual("Historycountry", {
  ref: "hcm_countries",
  localField: "Product_Origin_Country_Code",
  foreignField: "Country_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historyproductclass", {
  ref: "hcm_lut_classes",
  localField: "Product_Classes_Code",
  foreignField: "Class_Code",
  justOne: true // for many-to-1 relationships
});
Hcm_ProductHistorySchema.virtual("Historycertification", {
  ref: "hcm_lut_certificate",
  localField: "Product_Certification",
  foreignField: "Certificate_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("HistorySupplier", {
  ref: "hcm_supplier",
  localField: "Product_Supplier_Codes",
  foreignField: "Supplier_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("HistoryManufacturer", {
  ref: "hcm_supplier",
  localField: "Product_Manufacturer_Code",
  foreignField: "Supplier_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historyproductform", {
  ref: "hcm_lut_form",
  localField: "Product_Form_Code",
  foreignField: "Form_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historyproductpacking", {
  ref: "hcm_lut_packing",
  localField: "Product_Packing_Code",
  foreignField: "Packing_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historyproductrelease", {
  ref: "hcm_lut_release_type",
  localField: "Product_Release_Code",
  foreignField: "ReleaseType_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historyproductstrage", {
  ref: "hcm_lut_storage_type",
  localField: "Product_StorageType_Code",
  foreignField: "StorageType_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historyproductcategory", {
  ref: "hcm_lut_porduct_category",
  localField: "Product_ProductCategory_Code",
  foreignField: "ProductCategory_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historycustomer", {
  ref: "hcm_customer",
  localField: "Product_Customer_Codes",
  foreignField: "Customer_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historyweight", {
  ref: "hcm_lut_weight",
  localField: "Product_Weight_Unit_Code",
  foreignField: "Weight_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductHistorySchema.virtual("Historyconcentration", {
  ref: "hcm_lut_concentration",
  localField: "Product_Concentration_Unit_Code",
  foreignField: "Concentration_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_ProductHistorySchema.virtual("HistoryEditedUser", {
  ref: "hcm_user",
  localField: "Product_EditedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for many-to-1 relationships
});
Hcm_ProductHistorySchema.virtual("HistoryCheckedUser", {
  ref: "hcm_user",
  localField: "Product_CheckedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for many-to-1 relationships
});
var Hcm_ProductSchema = mongoose.Schema(
  {
    Product_Code: Number,
    Product_Name: String,
    Product_Suffix: String,
    Product_Chemical_Name: String,
    Product_Manufacturer: String,
    Product_Manufacturer_Code: Number,
    Product_Exporter: String,
    Product_Abbreviation: String,
    Product_IsActive: Number,
    Product_Molecular_Formula: String,
    Product_Molecular_Weight: String,
    Product_CAS_Number: String,
    Product_EC_Number: String,
    Product_Appearance: String,
    Product_Active_Content: String,
    Product_pH: String,
    Product_Sp_gravity: String,
    Product_Chloride: String,
    Product_Iron: String,
    Product_Phosphorous_Acid: String,
    Product_O_phosphate: String,
    Product_Hazen_color: String,
    Product_Category_ID: [Number],
    Product_Origin_Country_Code: Number,
    Product_Packing_Code: Number,
    Product_Supplier_Codes: [Number],
    Product_Customer_Codes: {
      type:[Number],
      default:[]
    },
    Product_SellingAreaCodes: [Number],
    Product_SellingAreaNames: [String],

    Product_MSDS: String,
    Product_Classes_Code: Number,
    Product_Assay: [String],
    Product_Form_Code: Number,
    Product_Certification: [Number],
    Melting_Unit_Tempreture_Unit_ID: Number,
    Boiling_Unit_Tempreture_Unit_ID: Number,
    Product_Release_Code: Number,
    Product_StorageType_Code: [Number],
    Product_ProductCategory_Code: [Number],
    Product_Volatile_Matter: String,
    Product_Sulphates: String,
    Product_Water_Insoluble_Matter: String,
    Product_Organic_Compounds: String,
    Product_Arsenic: String,
    Product_Lead: String,
    Product_Mercury: String,
    Product_Cadmium: String,
    Product_Heavy_Metals: String,
    Product_Ferrous_Fe2o3: String,
    Product_Alumumium_Al2O3: String,
    Product_Titanicum_Tio2: String,
    Product_Free_Fatty_Acids: String,
    Product_Peroxide_Value: String,
    Product_Iodine_Value: String,
    Product_Acetone: String,
    Product_Methanol: String,
    Product_Hydroyl_Number: String,
    Product_Impurities_Related_Substance: String,
    Product_Aldehyles: String,
    Product_Esters: String,
    Product_Chlorenated_Compound: String,
    Product_Water_Content: String,
    Product_Loss_On_Drying: String,
    Product_Starch_Test: String,
    Product_Sulfur_Dioxides_Residual: String,
    Product_Antimony: String,
    Product_Chrome: String,
    Product_Selenium: String,
    Product_Nickel: String,
    Product_Residual_On_Solvent: String,
    Product_Copper: String,
    Product_Oxalic_Acid: String,
    Product_Fumaric_Acid: String,
    Product_Maliec_Acid: String,
    Product_Non_Volatyl_Reside: String,
    Product_Ash: String,
    Product_Protien: String,
    Product_Nitrates: String,
    Product_Aflatoxine: String,
    Product_Melamine: String,
    Product_Free_Halogens: String,
    Product_Description: String,
    Product_Solubility: String,
    Product_Absorbance: String,
    Product_InfraRed_Absorption: String,
    Product_Think_Layer_Chromatography: String,
    Product_Identifications_Relative_Density: String,
    Product_Viscosity: String,
    Product_Foriein_Matter: String,
    Product_Relative_Density_From: String,
    Product_Relative_Density_To: String,
    Product_Bulk_Density_From: String,
    Product_Bulk_Density_to: String,
    Product_Relative_Index: String,
    Product_Spescific_Opticical_Rotation: String,
    Product_Specific_Surface_Area: String,
    Product_Residue_On_Sieve: String,
    Product_Boiling_Point: String,
    Product_Melting_Point: String,
    Product_Partical_Size: String,
    Product_Weight_Unit_Code: Number,
    Product_Weight_Value: Number,
    Product_Concentration_Unit_Code: Number,
    Product_Concentration_Value: String,
    Product_Remarkes: String,
    Product_Total_Plate_Count: String,
    Product_EColi: String,
    Product_Yeast: String,
    Product_Mould: String,
    Product_Pathogenic_Bacterium: String,
    Product_Escherichia_Cali: String,
    Product_Salmonila: String,
    Product_Staphyloccuse_Aureus: String,
    // Inventory Fields
    Product_ExpirationPeriod  : Number, // number of monthes that the product can be valid befor expiration date,
    Product_MainUnit                                 :{ // وحده الصنف الكبري
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_lut_product_unit'
    },
    Product_MiddleUnit                               :{ // وحده الصنف الوسطي
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_lut_product_unit'
    },
    Product_MiddleUnitCountInMainUnit                : Number, //عدد الوحدات الوسطى المتواجدة في الوحدة الكبرى
    
    Product_SmallUnit                                :{ //وحده الصنف الصغري
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_lut_product_unit'
    },
    Product_SmallUnitCountInMiddleUnit               : Number, //عدد الوحدات الصعرى المتواجدة في الوحدة المتوسطة
    Product_MinStocklimit                            : Number, // حد الطلب
    Product_Origin_Variants                   : [{ // multiselection, and should replace norma origin field but this replacement will be done later
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_lut_origin_variants'
    }],
    // end of Inventory Fields
    Product_Extra1: String,
    Product_Extra2: String,
    Product_Extra3: String,
    Product_Extra4: String,
    Product_Extra5: String,
    Product_Extra6: String,
    Product_Extra7: String,
    Product_Extra8: String,
    Product_Extra9: String,
    Product_Extra10: String,
    Product_Extra11: String,
    Product_IsChecked: {
      type: Boolean,
      default: false
    },
    Decline_Comment:{
      type :String,
      default:""
    },
    Product_DeclinedBy_User_Code: Number,
    Product_EditedBy_User_Code: Number,
    Product_EditingTime: Date,
    history: [Hcm_ProductHistorySchema],
    Product_Documents:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'hcm_lut_document'
    }]
  },
  
  {
    toJSON: { virtuals: true }
  }
);

Hcm_ProductSchema.virtual("DeclinedUser", {
  ref: "hcm_user",
  localField: "Product_DeclinedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for 1-to-1 relationships
});

Hcm_ProductSchema.virtual("Category", {
  ref: "hcm_categories",
  localField: "Product_Category_ID",
  foreignField: "Category_ID",
  justOne: false // for many-to-1 relationships
});
Hcm_ProductSchema.virtual("sellingArea", {
  ref: "hcm_lut_sell_area",
  localField: "Product_SellingAreaCodes",
  foreignField: "SellingArea_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_ProductSchema.virtual("country", {
  ref: "hcm_countries",
  localField: "Product_Origin_Country_Code",
  foreignField: "Country_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("productclass", {
  ref: "hcm_lut_classes",
  localField: "Product_Classes_Code",
  foreignField: "Class_Code",
  justOne: true // for many-to-1 relationships
});
Hcm_ProductSchema.virtual("certification", {
  ref: "hcm_lut_certificate",
  localField: "Product_Certification",
  foreignField: "Certificate_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("Supplier", {
  ref: "hcm_supplier",
  localField: "Product_Supplier_Codes",
  foreignField: "Supplier_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("Manufacturer", {
  ref: "hcm_supplier",
  localField: "Product_Manufacturer_Code",
  foreignField: "Supplier_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("productform", {
  ref: "hcm_lut_form",
  localField: "Product_Form_Code",
  foreignField: "Form_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("productpacking", {
  ref: "hcm_lut_packing",
  localField: "Product_Packing_Code",
  foreignField: "Packing_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("productrelease", {
  ref: "hcm_lut_release_type",
  localField: "Product_Release_Code",
  foreignField: "ReleaseType_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("productstrage", {
  ref: "hcm_lut_storage_type",
  localField: "Product_StorageType_Code",
  foreignField: "StorageType_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("productcategory", {
  ref: "hcm_lut_porduct_category",
  localField: "Product_ProductCategory_Code",
  foreignField: "ProductCategory_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("customer", {
  ref: "hcm_customer",
  localField: "Product_Customer_Codes",
  foreignField: "Customer_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("weight", {
  ref: "hcm_lut_weight",
  localField: "Product_Weight_Unit_Code",
  foreignField: "Weight_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_ProductSchema.virtual("concentration", {
  ref: "hcm_lut_concentration",
  localField: "Product_Concentration_Unit_Code",
  foreignField: "Concentration_Code",
  justOne: false // for many-to-1 relationships
});

var Hcm_Product = (module.exports = mongoose.model(
  "hcm_product",
  Hcm_ProductSchema
));

module.exports.getLastCode = function(callback) {
  Hcm_Product.findOne({}, callback).sort({ Product_Code: -1 });
};
